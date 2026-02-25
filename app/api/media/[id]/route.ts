import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        if (!id) return new NextResponse("Media ID is required", { status: 400 });

        // Get media asset to find its storage path
        const { data: mediaAsset } = await supabaseAdmin
             .from("media_assets")
             .select("*")
             .eq("id", id)
             .eq("user_id", userId)
             .single();

        if (!mediaAsset) {
             return new NextResponse("Media not found", { status: 404 });
        }

        // Delete from database
        const { error } = await supabaseAdmin
            .from("media_assets")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        // Try to delete from storage
        try {
            const urlObj = new URL(mediaAsset.url);
            const pathParts = urlObj.pathname.split('/media/');
            if (pathParts.length > 1) {
                const storagePath = decodeURIComponent(pathParts[1]);
                await supabaseAdmin.storage.from("media").remove([storagePath]);
            }
        } catch(e) {
            console.warn("Failed to delete from storage:", e);
        }

        return new NextResponse("Deleted successfully", { status: 200 });
    } catch (error) {
        console.error("[MEDIA_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
