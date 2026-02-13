import { google } from 'googleapis';
import axios from 'axios';
import { supabaseAdmin } from './supabase';

export async function publishToYouTube({
    videoUrl,
    title,
    description,
    userId,
    platform = 'youtube'
}: {
    videoUrl: string;
    title: string;
    description: string;
    userId: string;
    platform?: string;
}) {
    // 1. Fetch tokens from Supabase
    const { data: connection, error: connectionError } = await supabaseAdmin
        .from('social_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('platform', platform)
        .single();

    if (connectionError || !connection) {
        throw new Error(`No YouTube connection found for user ${userId}: ${connectionError?.message}`);
    }

    // 2. Setup OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/settings/social/callback/youtube`
    );

    oauth2Client.setCredentials({
        access_token: connection.access_token,
        refresh_token: connection.refresh_token,
        expiry_date: connection.expires_at ? new Date(connection.expires_at).getTime() : undefined
    });

    // 3. Setup YouTube API
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // 4. Download video as stream
    const response = await axios({
        method: 'get',
        url: videoUrl,
        responseType: 'stream'
    });

    // 5. Upload to YouTube
    const youtubeRes = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
            snippet: {
                title: title.substring(0, 100), // YouTube Limit
                description: description,
                categoryId: '24', // Entertainment
                tags: ['vidmaxx', 'ai-generated', 'shorts']
            },
            status: {
                privacyStatus: 'public', // Or 'unlisted' during initial testing
                selfDeclaredMadeForKids: false,
            },
        },
        media: {
            body: response.data,
        },
    });

    // 6. Check if tokens were refreshed and update Supabase if so
    // Google library might refresh tokens automatically if refresh_token is present
    const currentTokens = oauth2Client.credentials;
    if (currentTokens.access_token !== connection.access_token) {
        await supabaseAdmin
            .from('social_connections')
            .update({
                access_token: currentTokens.access_token,
                expires_at: currentTokens.expiry_date ? new Date(currentTokens.expiry_date).toISOString() : null
            })
            .eq('id', connection.id);
    }

    return youtubeRes.data;
}
