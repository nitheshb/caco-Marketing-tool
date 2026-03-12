import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { model } from '@/lib/gemini';

export async function POST(req: Request) {
    try {
        await getAuthUser(req);
        const body = await req.json();
        const type = (body?.type || 'image') as 'image' | 'video';
        const refine = body?.refine as { originalPrompt?: string; feedback?: string } | undefined;

        const systemPrompt = refine?.originalPrompt
            ? `
You are an expert at refining prompts for AI image generation based on user feedback.

ORIGINAL PROMPT that was used:
"${refine.originalPrompt}"

USER FEEDBACK (what they didn't like / what to change):
"${refine.feedback || 'No specific feedback provided.'}"

Generate exactly 8 refined prompt suggestions that address the feedback while keeping the good parts of the original.
Each prompt should be 1-2 sentences, specific and evocative.
- Incorporate the user's feedback and requested changes
- Fix what they didn't like
- Keep the overall intent where feedback doesn't contradict it
- Be concrete and actionable

Return ONLY a valid JSON array of 8 strings. No markdown, no code blocks.
Example format: ["Refined prompt one...", "Refined prompt two...", ...]
`
            : `
You are an expert at creating creative, varied prompts for AI image and video generation.
Generate exactly 8 diverse prompt suggestions that users can pick from.
Each prompt should be 1-2 sentences, specific and evocative - like trending prompts on creative AI galleries.

Context: ${type === 'image' ? 'Image editing / poster generation - backgrounds, style changes, product shots, portraits, promotional visuals' : 'Video / reel generation - motion, transitions, product reveals'}

Requirements:
- Each prompt must be unique and cover different styles (cinematic, minimalist, bold, vintage, etc.)
- Mix use cases: product promo, portrait editing, background replacement, brand assets, social media
- Be concrete (e.g. "Replace the background with a bright outdoor brunch setup" not "Make it look nice")
- Return ONLY a valid JSON array of 8 strings. No markdown, no code blocks.

Example format: ["Prompt one...", "Prompt two...", ...]
`;

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();
        if (!text) throw new Error('No response from AI');

        let clean = text.trim();
        if (clean.startsWith('```')) {
            clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
        }
        const suggestions = JSON.parse(clean) as string[];
        if (!Array.isArray(suggestions) || suggestions.length === 0) {
            throw new Error('Invalid suggestions format');
        }

        return NextResponse.json({ suggestions: suggestions.slice(0, 8) });
    } catch (error) {
        console.error('[POSTERS_SUGGESTIONS]', error);
        const message = error instanceof Error ? error.message : 'Failed to get suggestions';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
