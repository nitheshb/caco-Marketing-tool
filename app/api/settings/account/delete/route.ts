import { getAuthUser } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;

export async function DELETE(req: Request) {
    try {
        const { userId } = await getAuthUser(req);

        // 1. Delete all user data from Supabase
        const { error: videoError } = await supabaseAdmin
            .from('videos')
            .delete()
            .eq('user_id', userId);

        if (videoError) console.error("Error deleting videos:", videoError);

        const { error: seriesError } = await supabaseAdmin
            .from('series')
            .delete()
            .eq('user_id', userId);

        if (seriesError) console.error("Error deleting series:", seriesError);

        const { error: socialError } = await supabaseAdmin
            .from('social_connections')
            .delete()
            .eq('user_id', userId);

        if (socialError) console.error("Error deleting social connections:", socialError);

        const { error: userError } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('user_id', userId);

        if (userError) console.error("Error deleting user:", userError);

        // 2. Delete user from Firebase via REST API (uses the user's own ID token)
        const authHeader = req.headers.get('Authorization');
        const idToken = authHeader?.split('Bearer ')[1];
        if (idToken) {
            try {
                await fetch(
                    `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${FIREBASE_API_KEY}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idToken }),
                    }
                );
            } catch (firebaseErr) {
                console.error("Error deleting Firebase user:", firebaseErr);
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        console.error("Account deletion error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
