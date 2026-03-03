import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.REMOTION_LAMBDA_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.REMOTION_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.REMOTION_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

/**
 * Parse an S3 URL into bucket and key.
 * Supports: https://{bucket}.s3.{region}.amazonaws.com/{key}
 *       and https://s3.{region}.amazonaws.com/{bucket}/{key}
 */
function parseS3Url(url: string): { bucket: string; key: string } | null {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname;

        // Pattern: {bucket}.s3.{region}.amazonaws.com/{key}
        const virtualHosted = host.match(/^(.+)\.s3[.-].*\.amazonaws\.com$/);
        if (virtualHosted) {
            return { bucket: virtualHosted[1], key: decodeURIComponent(parsed.pathname.slice(1)) };
        }

        // Pattern: s3.{region}.amazonaws.com/{bucket}/{key}
        const pathStyle = host.match(/^s3[.-].*\.amazonaws\.com$/);
        if (pathStyle) {
            const parts = parsed.pathname.slice(1).split("/");
            const bucket = parts[0];
            const key = decodeURIComponent(parts.slice(1).join("/"));
            return { bucket, key };
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Extract Supabase storage path from a public URL.
 * e.g. https://xyz.supabase.co/storage/v1/object/public/voiceovers/seriesId/123.mp3
 *   -> { bucket: "voiceovers", path: "seriesId/123.mp3" }
 */
function parseSupabaseStorageUrl(url: string): { bucket: string; path: string } | null {
    try {
        const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
        if (match) {
            return { bucket: match[1], path: decodeURIComponent(match[2]) };
        }
        return null;
    } catch {
        return null;
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ videoId: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { videoId } = await params;

        // 1. Fetch the video record and verify ownership
        const { data: video, error: fetchError } = await supabaseAdmin
            .from("videos")
            .select("*")
            .eq("id", videoId)
            .eq("user_id", userId)
            .single();

        if (fetchError || !video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        const deletionErrors: string[] = [];

        // 2. Delete the rendered video from AWS S3
        if (video.video_url) {
            const s3Info = parseS3Url(video.video_url);
            if (s3Info) {
                try {
                    await s3.send(new DeleteObjectCommand({
                        Bucket: s3Info.bucket,
                        Key: s3Info.key,
                    }));
                    console.log(`[DELETE] S3 video deleted: ${s3Info.key}`);
                } catch (err) {
                    console.error("[DELETE] Failed to delete S3 video:", err);
                    deletionErrors.push("S3 video deletion failed");
                }
            }
        }

        // 3. Delete voiceover from Supabase Storage
        if (video.voiceover_url) {
            const storageInfo = parseSupabaseStorageUrl(video.voiceover_url);
            if (storageInfo) {
                try {
                    const { error } = await supabaseAdmin.storage
                        .from(storageInfo.bucket)
                        .remove([storageInfo.path]);
                    if (error) throw error;
                    console.log(`[DELETE] Voiceover deleted: ${storageInfo.path}`);
                } catch (err) {
                    console.error("[DELETE] Failed to delete voiceover:", err);
                    deletionErrors.push("Voiceover deletion failed");
                }
            }
        }

        // 4. Delete images from Supabase Storage
        if (video.images && Array.isArray(video.images)) {
            for (const img of video.images) {
                if (img.url) {
                    const storageInfo = parseSupabaseStorageUrl(img.url);
                    if (storageInfo) {
                        try {
                            const { error } = await supabaseAdmin.storage
                                .from(storageInfo.bucket)
                                .remove([storageInfo.path]);
                            if (error) throw error;
                            console.log(`[DELETE] Image deleted: ${storageInfo.path}`);
                        } catch (err) {
                            console.error(`[DELETE] Failed to delete image ${img.url}:`, err);
                            deletionErrors.push(`Image deletion failed for scene ${img.sceneId}`);
                        }
                    }
                }
            }
        }

        // 5. Delete the video record from the database
        const { error: deleteError } = await supabaseAdmin
            .from("videos")
            .delete()
            .eq("id", videoId)
            .eq("user_id", userId);

        if (deleteError) {
            console.error("[DELETE] DB deletion failed:", deleteError);
            return NextResponse.json(
                { error: "Failed to delete video record" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            warnings: deletionErrors.length > 0 ? deletionErrors : undefined,
        });
    } catch (error) {
        console.error("[VIDEO_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
