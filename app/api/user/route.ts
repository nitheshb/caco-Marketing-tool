import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const email = user.emailAddresses[0]?.emailAddress;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();

        // Upsert user data into the existing 'users' table
        const { error } = await supabaseAdmin
            .from('users')
            .upsert({
                user_id: userId,
                email: email,
                name: name,
                // Add any other existing columns if necessary
            }, {
                onConflict: 'user_id'
            });

        if (error) {
            console.error("Supabase Sync Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, user: { name, email, userId } });

    } catch (error: any) {
        console.error("User Sync API Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
