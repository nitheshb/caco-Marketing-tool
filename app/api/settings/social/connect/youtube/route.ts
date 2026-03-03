import { google } from 'googleapis';
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
            .select('client_id, client_secret')
            .eq('id', integrationId)
            .eq('user_id', userId)
            .single();

        if (error || !integration) {
            console.error("Failed to fetch integration credentials:", error);
            return new NextResponse("Invalid integration", { status: 400 });
        }

        const oauth2Client = new google.auth.OAuth2(
            integration.client_id,
            integration.client_secret,
            `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/settings/social/callback/youtube`
        );

        const scopes = [
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/userinfo.profile',
            'openid',
            'https://www.googleapis.com/auth/userinfo.email'
        ];

        const stateData = JSON.stringify({ userId, integrationId });

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent', // Force consent screen to ensure refresh token
            state: Buffer.from(stateData).toString('base64') // Pack state
        });

        return NextResponse.redirect(url);

    } catch (error: any) {
        console.error("YouTube Connect Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
