import { auth, createClerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

        // 1. Delete all user data from Supabase
        // Cascading deletes should be handled if foreign keys are set up with ON DELETE CASCADE
        // But let's be safe and delete manually if needed

        // Delete Videos
        const { error: videoError } = await supabaseAdmin
            .from('videos')
            .delete()
            .eq('user_id', userId);

        if (videoError) console.error("Error deleting videos:", videoError);

        // Delete Series
        const { error: seriesError } = await supabaseAdmin
            .from('series')
            .delete()
            .eq('user_id', userId);

        if (seriesError) console.error("Error deleting series:", seriesError);

        // Delete Social Connections
        const { error: socialError } = await supabaseAdmin
            .from('social_connections')
            .delete()
            .eq('user_id', userId);

        if (socialError) console.error("Error deleting social connections:", socialError);

        // 2. Delete User from Clerk
        await clerkClient.users.deleteUser(userId);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Account deletion error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
