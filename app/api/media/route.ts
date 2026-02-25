import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const searchParams = new URL(req.url).searchParams;
        const folderId = searchParams.get("folderId");

        let query = supabaseAdmin
            .from("media_assets")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (folderId === "null" || folderId === null) {
            query = query.is("folder_id", null);
        } else {
            query = query.eq("folder_id", folderId);
        }

        const { data, error } = await query;
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json(data);
    } catch (error) {
        console.error("[MEDIA_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folderId = formData.get("folderId") as string;

        if (!file) return new NextResponse("File is required", { status: 400 });

        // Buffer the file
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileExt = file.name.split('.').pop() || 'tmp';
        const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;

        // Upload to supabase storage
        const { data: storageData, error: storageError } = await supabaseAdmin
            .storage
            .from("media")
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (storageError) {
             console.error("Storage upload error:", storageError);
             return NextResponse.json({ error: storageError.message }, { status: 500 });
        }

        const { data: publicUrlData } = supabaseAdmin
            .storage
            .from("media")
            .getPublicUrl(fileName);

        // Save to database
        const { data: dbData, error: dbError } = await supabaseAdmin
            .from("media_assets")
            .insert({
                user_id: userId,
                folder_id: folderId === "null" || !folderId ? null : folderId,
                name: file.name,
                url: publicUrlData.publicUrl,
                type: file.type,
                size: file.size
            })
            .select()
            .single();

        if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

        return NextResponse.json(dbData);
    } catch (error) {
        console.error("[MEDIA_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
