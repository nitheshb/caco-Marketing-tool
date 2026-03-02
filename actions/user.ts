'use server'

import { getAuthUser } from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";

export async function syncUser() {
    try {
        const { userId, email, name } = await getAuthUser();

        if (!userId) {
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
                email: email || '',
                name: name || '',
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
