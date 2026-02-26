import { getAuthUser } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await getAuthUser(req);
        const { id } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('series')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await getAuthUser(req);
        const { id } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { error } = await supabaseAdmin
            .from('series')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await getAuthUser(req);
        const { id } = await params;
        const body = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Map frontend camelCase to database snake_case if providing full update
        const updateData: any = {};
        if (body.niche) updateData.niche = body.niche;
        if (body.isCustomNiche !== undefined) updateData.is_custom_niche = body.isCustomNiche;
        if (body.language) updateData.language = body.language;
        if (body.voice) updateData.voice = body.voice;
        if (body.modelName) updateData.model_name = body.modelName;
        if (body.modelLangCode) updateData.model_lang_code = body.modelLangCode;
        if (body.backgroundMusic) updateData.background_music = body.backgroundMusic;
        if (body.videoStyle) updateData.video_style = body.videoStyle;
        if (body.captionStyle) updateData.caption_style = body.captionStyle;
        if (body.seriesName) updateData.series_name = body.seriesName;
        if (body.duration) updateData.duration = body.duration;
        if (body.platforms) updateData.platforms = body.platforms;
        if (body.publishTime) updateData.publish_time = body.publishTime;
        if (body.status) updateData.status = body.status;

        const { error } = await supabaseAdmin
            .from('series')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
