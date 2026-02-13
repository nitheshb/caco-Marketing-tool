'use server'

import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function syncUser() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return { error: "User not found" };
        }

        // Check if user exists
        const { data: existingUser } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (!existingUser) {
            const { error } = await supabaseAdmin.from("users").insert({
                user_id: userId,
                email: user.emailAddresses[0].emailAddress,
                name: `${user.firstName} ${user.lastName}`,
            });

            if (error) {
                console.error("Error syncing user:", error);
                return { error: error.message };
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Sync user error:", error);
        return { error: "Internal server error" };
    }
}
