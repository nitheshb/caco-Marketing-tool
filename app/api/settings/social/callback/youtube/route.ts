import { google } from 'googleapis';
import { getAuthUser } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');
        const state = searchParams.get('state'); // Base64 encoded JSON { userId, integrationId }

        if (!code) {
            return new NextResponse("Missing code", { status: 400 });
        }

        let stateObj;
        try {
            const decodedState = Buffer.from(state || '', 'base64').toString('ascii');
            stateObj = JSON.parse(decodedState);
        } catch (e) {
            console.error("Failed to decode state:", e);
            return new NextResponse("Invalid state parameter", { status: 400 });
        }

        const { userId, integrationId } = stateObj;

        if (!userId || !integrationId) {
            return new NextResponse("Missing userId or integrationId in state", { status: 400 });
        }

        const { data: integration, error: integrationError } = await supabaseAdmin
            .from('social_integrations')
            .select('client_id, client_secret')
            .eq('id', integrationId)
            .eq('user_id', userId)
            .single();

        if (integrationError || !integration) {
            console.error("Failed to fetch custom integration credentials:", integrationError);
            return new NextResponse("Invalid integration", { status: 400 });
        }

        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/settings/social/callback/youtube`;
        console.log("DEBUG: YouTube Callback Hit");
        console.log("DEBUG: Code:", code?.substring(0, 10) + "...");
        console.log("DEBUG: Redirect URI used:", redirectUri);

        const oauth2Client = new google.auth.OAuth2(
            integration.client_id,
            integration.client_secret,
            redirectUri
        );

        // Exchange code for tokens
        let tokens;
        try {
            const response = await oauth2Client.getToken(code);
            tokens = response.tokens;
            console.log("DEBUG: Tokens acquired successfully");
        } catch (err: any) {
            console.error("DEBUG: getToken failed. Error details:", err.response?.data || err.message);
            throw err;
        }
        oauth2Client.setCredentials(tokens);

        // Get Channel info
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
        const channelResponse = await youtube.channels.list({
            part: ['snippet'],
            mine: true
        });

        const channel = channelResponse.data.items?.[0];
        const profileName = channel?.snippet?.title || 'YouTube Channel';
        const profileImage = channel?.snippet?.thumbnails?.default?.url || '';

        const channelId = channel?.id || '';

        // Store in Supabase
        const { error: upsertError } = await supabaseAdmin
            .from('social_connections')
            .upsert({
                user_id: userId,
                integration_id: integrationId,
                platform: 'youtube',
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
                profile_name: profileName,
                profile_image: profileImage,
                platform_user_id: channelId,
                internal_id: channelId,
                created_at: new Date().toISOString()
            }, { onConflict: 'user_id,platform,platform_user_id' });

        if (upsertError) {
            console.error("Supabase storage error:", upsertError);
            return new NextResponse("Failed to save connection", { status: 500 });
        }

        // Redirect back to settings with success
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings?connected=youtube`);

    } catch (error: any) {
        console.error("YouTube Callback Error:", error);

        let errorType = 'unknown';
        if (error.message?.includes('suspended')) {
            errorType = 'suspended';
        } else if (error.message?.includes('invalid_grant')) {
            errorType = 'invalid_grant';
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings?error=${errorType}`);
    }
}
