import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { platform, clientId, clientSecret } = await req.json();

        if (!platform || !clientId || !clientSecret) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Add to custom integrations
        const { data, error } = await supabaseAdmin
            .from('social_integrations')
            .upsert({
                user_id: userId,
                platform,
                client_id: clientId,
                client_secret: clientSecret,
                created_at: new Date().toISOString()
            }, { onConflict: 'user_id,platform,client_id' })
            .select()
            .single();

        if (error) {
            console.error("Failed to save integration:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
