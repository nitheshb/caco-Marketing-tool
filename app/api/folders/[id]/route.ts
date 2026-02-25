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

        if (!id) return new NextResponse("Folder ID is required", { status: 400 });

        const { error } = await supabaseAdmin
            .from("folders")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return new NextResponse("Deleted successfully", { status: 200 });
    } catch (error) {
        console.error("[FOLDER_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
