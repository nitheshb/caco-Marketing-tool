import { getAuthUser } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const { userId } = await getAuthUser(req);
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const searchParams = new URL(req.url).searchParams;
        const parentId = searchParams.get("parentId");

        let query = supabaseAdmin
            .from("folders")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (parentId === "null" || parentId === null) {
            query = query.is("parent_id", null);
        } else {
            query = query.eq("parent_id", parentId);
        }

        const { data, error } = await query;
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json(data);
    } catch (error) {
        console.error("[FOLDERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await getAuthUser(req);
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, parentId } = body;

        if (!name) return new NextResponse("Name is required", { status: 400 });

        const { data, error } = await supabaseAdmin
            .from("folders")
            .insert({
                user_id: userId,
                name,
                parent_id: parentId || null
            })
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json(data);
    } catch (error) {
        console.error("[FOLDERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
