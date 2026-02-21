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
    console.log('[YouTube] ===== START publishToYouTube =====');
    console.log('[YouTube] userId:', userId);
    console.log('[YouTube] videoUrl:', videoUrl);
    console.log('[YouTube] title:', title);

    // 1. Fetch tokens from Supabase
    console.log('[YouTube] Step 1: Fetching social_connections from Supabase...');
    const { data: connection, error: connectionError } = await supabaseAdmin
        .from('social_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('platform', platform)
        .single();

    if (connectionError || !connection) {
        console.error('[YouTube] No connection found!', connectionError);
        throw new Error(`No YouTube connection found for user ${userId}: ${connectionError?.message}`);
    }

    console.log('[YouTube] Connection found. ID:', connection.id);
    console.log('[YouTube] Has access_token:', !!connection.access_token);
    console.log('[YouTube] Has refresh_token:', !!connection.refresh_token);
    console.log('[YouTube] expires_at:', connection.expires_at);
    console.log('[YouTube] Token expired?', connection.expires_at ? new Date(connection.expires_at) < new Date() : 'no expiry stored');

    // 2. Setup OAuth2 client
    console.log('[YouTube] Step 2: Setting up OAuth2 client...');
    console.log('[YouTube] GOOGLE_CLIENT_ID set:', !!process.env.GOOGLE_CLIENT_ID);
    console.log('[YouTube] GOOGLE_CLIENT_SECRET set:', !!process.env.GOOGLE_CLIENT_SECRET);

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

    // 3. Force token refresh to avoid "Unauthorized" errors from expired access tokens
    console.log('[YouTube] Step 3: Forcing token refresh...');
    try {
        const { token } = await oauth2Client.getAccessToken();
        console.log('[YouTube] getAccessToken() succeeded. Got token:', !!token);
        console.log('[YouTube] Token changed?', token !== connection.access_token);
        if (token && token !== connection.access_token) {
            console.log('[YouTube] Access token was refreshed — saving to Supabase...');
            const { error: updateError } = await supabaseAdmin
                .from('social_connections')
                .update({
                    access_token: token,
                    expires_at: oauth2Client.credentials.expiry_date
                        ? new Date(oauth2Client.credentials.expiry_date).toISOString()
                        : null
                })
                .eq('id', connection.id);
            if (updateError) {
                console.error('[YouTube] Failed to save refreshed token:', updateError);
            } else {
                console.log('[YouTube] Refreshed token saved successfully');
            }
        }
    } catch (refreshError: any) {
        console.error('[YouTube] Token refresh FAILED!');
        console.error('[YouTube] Refresh error name:', refreshError.name);
        console.error('[YouTube] Refresh error message:', refreshError.message);
        console.error('[YouTube] Refresh error response status:', refreshError.response?.status);
        console.error('[YouTube] Refresh error response data:', JSON.stringify(refreshError.response?.data));
        throw new Error(`YouTube token refresh failed. Please reconnect your YouTube account in Settings. (${refreshError.message})`);
    }

    // 4. Setup YouTube API
    console.log('[YouTube] Step 4: Setting up YouTube API client...');
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // 5. Download video as stream
    console.log('[YouTube] Step 5: Downloading video from:', videoUrl);
    let response;
    try {
        response = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream'
        });
        console.log('[YouTube] Video download succeeded. Status:', response.status);
        console.log('[YouTube] Content-Type:', response.headers['content-type']);
        console.log('[YouTube] Content-Length:', response.headers['content-length']);
    } catch (downloadError: any) {
        console.error('[YouTube] Video download FAILED:', downloadError.message);
        throw new Error(`Failed to download video: ${downloadError.message}`);
    }

    // 6. Upload to YouTube
    console.log('[YouTube] Step 6: Uploading to YouTube...');
    try {
        const youtubeRes = await youtube.videos.insert({
            part: ['snippet', 'status'],
            requestBody: {
                snippet: {
                    title: title.substring(0, 100),
                    description: description,
                    categoryId: '24',
                    tags: ['vidmaxx', 'ai-generated', 'shorts']
                },
                status: {
                    privacyStatus: 'public',
                    selfDeclaredMadeForKids: false,
                },
            },
            media: {
                body: response.data,
            },
        });

        console.log('[YouTube] Upload SUCCESS! Video ID:', youtubeRes.data.id);
        console.log('[YouTube] Upload status:', youtubeRes.data.status?.uploadStatus);

        // 7. Save any post-upload token refresh
        const currentTokens = oauth2Client.credentials;
        if (currentTokens.access_token !== connection.access_token) {
            console.log('[YouTube] Post-upload token refresh detected, saving...');
            await supabaseAdmin
                .from('social_connections')
                .update({
                    access_token: currentTokens.access_token,
                    expires_at: currentTokens.expiry_date ? new Date(currentTokens.expiry_date).toISOString() : null
                })
                .eq('id', connection.id);
        }

        console.log('[YouTube] ===== END publishToYouTube SUCCESS =====');
        return youtubeRes.data;

    } catch (uploadError: any) {
        console.error('[YouTube] Upload FAILED!');
        console.error('[YouTube] Error name:', uploadError.name);
        console.error('[YouTube] Error message:', uploadError.message);
        console.error('[YouTube] Error code:', uploadError.code);
        console.error('[YouTube] Error status:', uploadError.response?.status);
        console.error('[YouTube] Error statusText:', uploadError.response?.statusText);
        console.error('[YouTube] Error data:', JSON.stringify(uploadError.response?.data || uploadError.errors));
        console.error('[YouTube] Full error:', JSON.stringify(uploadError, Object.getOwnPropertyNames(uploadError)));
        throw uploadError;
    }
}
