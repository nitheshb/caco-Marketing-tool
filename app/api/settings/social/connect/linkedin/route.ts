import { auth as clerkAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const { userId } = await clerkAuth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const integrationId = searchParams.get('integrationId');

        if (!integrationId) {
            return new NextResponse("Missing integration ID. Please use a custom app.", { status: 400 });
        }

        const { data: integration, error } = await supabaseAdmin
            .from('social_integrations')
            .select('client_id')
            .eq('id', integrationId)
            .eq('user_id', userId)
            .single();

        if (error || !integration) {
            console.error("Failed to fetch integration credentials:", error);
            return new NextResponse("Invalid integration", { status: 400 });
        }

        const clientId = integration.client_id;

        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/settings/social/callback/linkedin`;

        const scopes = ['openid', 'profile', 'email', 'w_member_social', 'w_organization_social'];

        const stateData = JSON.stringify({ userId, integrationId });

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: redirectUri,
            state: Buffer.from(stateData).toString('base64'), // encode state since it's an object now
            scope: scopes.join(' '),
        });

        const url = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;

        return NextResponse.redirect(url);

    } catch (error: any) {
        console.error("LinkedIn Connect Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
