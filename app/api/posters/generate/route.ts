import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPowerPrompt, type PostersGenerateType } from '@/lib/posters-gemini';

const imageGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// responseModalities: IMAGE is required; otherwise the model returns text instead of an image
const imageModel = imageGenAI.getGenerativeModel({
    model: 'gemini-2.5-flash-image',
    generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
    } as Parameters<typeof imageGenAI.getGenerativeModel>[0]['generationConfig'],
});

async function ensureBucketExists(bucketName: string) {
    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
    if (error) return;
    const exists = buckets?.some((b) => b.name === bucketName);
    if (exists) return;
    await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    });
}

async function generateAndUploadImage(
    prompt: string,
    userId: string,
    referenceImage?: { base64: string; mimeType: string }
) {
    await ensureBucketExists('posters');

    const content: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = referenceImage
        ? [
              { inlineData: { mimeType: referenceImage.mimeType, data: referenceImage.base64 } },
              { text: prompt },
          ]
        : [{ text: prompt }];

    const result = await imageModel.generateContent(content);
    const response = await result.response;

    const part = response.candidates?.[0]?.content?.parts?.find((p) => (p as any).inlineData) as
        | { inlineData?: { data: string } }
        | undefined;

    if (!part?.inlineData?.data) {
        console.error('Poster image generation response:', JSON.stringify(response, null, 2));
        throw new Error('Image model did not return an image');
    }

    const buffer = Buffer.from(part.inlineData.data, 'base64');
    const fileName = `${userId}/poster-${Date.now()}.png`;

    const { error: uploadError } = await supabaseAdmin.storage.from('posters').upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: true,
    });

    if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const {
        data: { publicUrl },
    } = supabaseAdmin.storage.from('posters').getPublicUrl(fileName);

    return publicUrl;
}

export async function POST(req: Request) {
    try {
        const { userId } = await getAuthUser(req);
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const type = (body?.type || 'image') as PostersGenerateType;
        const description = String(body?.description || '').trim();

        if (!description) {
            return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }

        const requirements = body?.requirements ? String(body.requirements) : undefined;
        const format = body?.format ? String(body.format) : undefined;
        const style = body?.style ? String(body.style) : undefined;
        const tone = body?.tone ? String(body.tone) : undefined;
        const referenceImageBase64 = typeof body?.referenceImageBase64 === 'string' ? body.referenceImageBase64 : undefined;
        const referenceImageMimeType =
            typeof body?.referenceImageMimeType === 'string' ? body.referenceImageMimeType : 'image/png';

        const { prompt, negativePrompt } = await buildPowerPrompt({
            type,
            description,
            requirements,
            format,
            style,
            tone,
            hasReferenceImage: !!referenceImageBase64,
        });

        if (type === 'video') {
            return NextResponse.json({ prompt, negativePrompt, outputUrl: null, generationId: null }, { status: 200 });
        }

        const referenceImage =
            referenceImageBase64 ?
                { base64: referenceImageBase64, mimeType: referenceImageMimeType }
            : undefined;
        const outputUrl = await generateAndUploadImage(prompt, userId, referenceImage);

        const parentId = body?.parentId ? String(body.parentId) : null;
        const { data: generation, error: insertError } = await supabaseAdmin
            .from('poster_generations')
            .insert({
                user_id: userId,
                type,
                output_url: outputUrl,
                description,
                requirements: requirements || null,
                format: format || null,
                style: style || null,
                tone: tone || null,
                prompt,
                negative_prompt: negativePrompt || null,
                parent_id: parentId || null,
            })
            .select('id, output_url, created_at')
            .single();

        if (insertError) {
            console.error('[POSTERS_GENERATE] Insert failed:', insertError);
        }

        return NextResponse.json({
            prompt,
            negativePrompt,
            outputUrl,
            generationId: generation?.id ?? null,
            generation,
        }, { status: 200 });
    } catch (error) {
        console.error('[POSTERS_GENERATE]', error);
        const message = error instanceof Error ? error.message : 'Failed to generate';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

