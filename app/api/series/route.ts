import { getAuthUser } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { userId } = await getAuthUser(req);

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const data = await req.json();

        // Map frontend camelCase to database snake_case
        const { error } = await supabaseAdmin
            .from('series')
            .insert({
                user_id: userId,
                niche: data.niche,
                is_custom_niche: data.isCustomNiche,
                language: data.language,
                voice: data.voice,
                model_name: data.modelName,
                model_lang_code: data.modelLangCode,
                background_music: data.backgroundMusic,
                video_style: data.videoStyle,
                caption_style: data.captionStyle,
                series_name: data.seriesName,
                duration: data.duration,
                platforms: data.platforms,
                publish_time: data.publishTime,
                status: 'active'
            });

        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("API Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { userId } = await getAuthUser(req);

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('series')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error("API Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
