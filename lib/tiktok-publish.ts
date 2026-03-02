import { supabaseAdmin } from "./supabase";

interface TikTokPublishParams {
    userId: string;
    text: string;
    videoUrl: string;
}

/**
 * Publish a video to TikTok.
 * Uses the TikTok Content Posting API (v2).
 */
export async function publishToTikTok({ userId, text, videoUrl }: TikTokPublishParams) {
    console.log('[TikTok] Starting publish flow for user:', userId);

    // 1. Fetch connection details
    const { data: connection, error } = await supabaseAdmin
        .from('social_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('platform', 'tiktok')
        .single();

    if (error || !connection) {
        throw new Error(`Failed to fetch TikTok connection: ${error?.message || 'Not found'}`);
    }

    let accessToken = connection.access_token;
    const expiresAt = connection.expires_at;

    // 2. Check token expiration and refresh if needed
    if (expiresAt && new Date(expiresAt) < new Date()) {
        console.log('[TikTok] Token expired, refreshing...');
        const refreshRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_key: process.env.TIKTOK_CLIENT_KEY!,
                client_secret: process.env.TIKTOK_CLIENT_SECRET!,
                grant_type: 'refresh_token',
                refresh_token: connection.refresh_token,
            }),
        });

        const refreshData = await refreshRes.json();
        if (!refreshRes.ok) {
            console.error("[TikTok] Refresh Token Error:", refreshData);
            throw new Error("Failed to refresh TikTok access token");
        }

        accessToken = refreshData.access_token;
        const newExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000).toISOString();

        // Update in DB
        await supabaseAdmin
            .from('social_connections')
            .update({
                access_token: accessToken,
                refresh_token: refreshData.refresh_token,
                expires_at: newExpiresAt
            })
            .eq('id', connection.id);
            
        console.log('[TikTok] Token refreshed successfully');
    }

    // 3. Initialize Publishing
    console.log('[TikTok] Initializing post...');
    const publishUrl = 'https://open.tiktokapis.com/v2/post/publish/video/init/';
    
    const body = {
        post_info: {
            title: text.substring(0, 150), // TikTok title limit
            privacy_level: 'PUBLIC_TO_EVERYONE',
            disable_duet: false,
            disable_stitch: false,
            disable_comment: false,
            video_ad_tag: false
        },
        source_info: {
            source: 'PULL_FROM_URL',
            video_url: videoUrl
        }
    };

    const response = await fetch(publishUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok || data.error?.code !== 'ok') {
        console.error("[TikTok] Publish Init Error:", data);
        throw new Error(data.error?.message || "Failed to initialize TikTok publish");
    }

    const publishId = data.data.publish_id;
    console.log('[TikTok] Publish initialized. ID:', publishId);

    return {
        success: true,
        publishId: publishId,
        platform: 'tiktok'
    };
}
