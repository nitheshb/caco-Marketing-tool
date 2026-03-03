import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { seriesId, testMode } = await req.json();
        if (!seriesId) {
            return new NextResponse("Missing series ID", { status: 400 });
        }

        // Create an initial video record with 'processing' status
        const { data: videoData, error: videoError } = await supabaseAdmin
            .from('videos')
            .insert({
                series_id: seriesId,
                user_id: userId,
                status: 'processing'
            })
            .select()
            .single();

        if (videoError) {
            console.error("Failed to create video record:", videoError);
            return new NextResponse("Failed to initialize video generation", { status: 500 });
        }

        // Trigger the Inngest event with the videoId and testMode flag
        await inngest.send({
            name: "video/generate",
            data: {
                seriesId,
                videoId: videoData.id,
                testMode: !!testMode
            }
        });

        return NextResponse.json({ success: true, videoId: videoData.id });
    } catch (error) {
        console.error("Trigger API Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
