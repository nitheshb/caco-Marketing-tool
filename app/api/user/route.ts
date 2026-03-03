import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth-helpers";

export async function POST(req: Request) {
    try {
        const { userId, email, name } = await getAuthUser(req);
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { org_id, project_id, source_login } = await req.json().catch(() => ({}));

        // Upsert on email so that old Clerk-era rows (same email, different user_id)
        // get updated to the current Firebase UID rather than causing a duplicate key error.
        const { error } = await supabaseAdmin
            .from('users')
            .upsert({
                user_id: userId,
                email: email || '',
                name: name || '',
                org_id: org_id || null,
                project_id: project_id || null,
                source_login: source_login || 'vidmaxx',
            }, {
                onConflict: 'email',
                ignoreDuplicates: false,
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
