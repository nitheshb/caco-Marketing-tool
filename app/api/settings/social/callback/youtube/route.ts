import { google } from 'googleapis';
import { auth as clerkAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');
        const state = searchParams.get('state'); // This is the userId passed from redirect

        if (!code) {
            return new NextResponse("Missing code", { status: 400 });
        }

        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/settings/social/callback/youtube`;
        console.log("DEBUG: YouTube Callback Hit");
        console.log("DEBUG: Code:", code?.substring(0, 10) + "...");
        console.log("DEBUG: Redirect URI used:", redirectUri);

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
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

        // Store in Supabase
        const { error: upsertError } = await supabaseAdmin
            .from('social_connections')
            .upsert({
                user_id: state,
                platform: 'youtube',
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
                profile_name: profileName,
                profile_image: profileImage,
                created_at: new Date().toISOString()
            }, { onConflict: 'user_id,platform' });

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
