import { getAuthUser } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const { userId } = await getAuthUser(req);
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
        
        // Dynamically get the current host (works for ngrok or localhost)
        const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
        const protocol = host?.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;
        const redirectUri = `${baseUrl}/api/settings/social/callback/instagram`;

        const scopes = [
            'instagram_business_basic',
            'instagram_business_content_publish',
            'instagram_business_manage_comments',
            'instagram_business_manage_insights'
        ];

        const stateData = JSON.stringify({ userId, integrationId });

        const params = new URLSearchParams({
            enable_fb_login: '0',
            client_id: clientId,
            redirect_uri: redirectUri,
            state: Buffer.from(stateData).toString('base64'),
            scope: scopes.join(','),
            response_type: 'code'
        });

        const url = `https://www.instagram.com/oauth/authorize?${params.toString()}`;

        return NextResponse.redirect(url);

    } catch (error: any) {
        console.error("Instagram Connect Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
