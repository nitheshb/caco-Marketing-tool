import { getAuthUser } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { userId, email, name } = await getAuthUser(req);

        // Upsert user data into the existing 'users' table
        const { error } = await supabaseAdmin
            .from('users')
            .upsert({
                user_id: userId,
                email: email || '',
                name: name || '',
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
