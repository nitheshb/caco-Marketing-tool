import { getAuthUser } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { userId, email, name } = await getAuthUser(req);

        const { org_id, project_id, source_login } = await req.json().catch(() => ({}));

        // Upsert user data into the existing 'users' table
        const { error } = await supabaseAdmin
            .from('users')
            .upsert({
                user_id: userId,
                email: email || '',
                name: name || '',
                org_id: org_id || null,
                project_id: project_id || null,
                source_login: source_login || 'vidmaxx', // default to direct login
            }, {
                onConflict: 'user_id'
            });

        if (error) {
            console.error("Supabase Sync Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, user: { name, email, userId } });

    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        console.error("User Sync API Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
