import { supabaseAdmin } from "./supabase";

interface FacebookPublishParams {
    connectionId: string;
    text: string;
    mediaUrl?: string | null;
}

export async function publishToFacebook({ connectionId, text, mediaUrl }: FacebookPublishParams) {
    // 1. Fetch connection details
    const { data: connection, error } = await supabaseAdmin
        .from('social_connections')
        .select('access_token, internal_id')
        .eq('id', connectionId)
        .eq('platform', 'facebook')
        .single();

    if (error || !connection) {
        throw new Error(`Failed to fetch Facebook connection: ${error?.message || 'Not found'}`);
    }

    const { access_token: accessToken, internal_id: pageId } = connection;

    if (!accessToken || !pageId) {
        throw new Error("Missing access token or page ID for Facebook connection");
    }

    // 2. Determine post type based on mediaUrl
    let url = `https://graph.facebook.com/v20.0/${pageId}/feed`;
    const payload: any = {
        access_token: accessToken,
    };

    if (mediaUrl) {
        const isVideo = mediaUrl.match(/\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i) || mediaUrl.includes('inngest') || mediaUrl.includes('supabase'); // Simplified check, usually our generated videos are mp4s or from our storage
        
        if (isVideo) {
            url = `https://graph.facebook.com/v20.0/${pageId}/videos`;
            payload.description = text;
            payload.file_url = mediaUrl;
        } else {
            // Assume Image
            url = `https://graph.facebook.com/v20.0/${pageId}/photos`;
            payload.message = text;
            payload.url = mediaUrl;
        }
    } else {
        // Text only
        payload.message = text;
    }

    // 3. Make the API request
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok) {
        console.error("Facebook Graph API Error Response:", responseData);
        throw new Error(responseData.error?.message || "Failed to publish to Facebook");
    }

    return {
        success: true,
        postId: responseData.id || responseData.post_id,
        platform: 'facebook'
    };
}
