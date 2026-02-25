import axios from 'axios';
import { supabaseAdmin } from './supabase';

const LINKEDIN_API_VERSION = '202501';

/**
 * Refresh a LinkedIn access token using the refresh_token grant.
 * Returns the new access token or throws if refresh fails.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function refreshLinkedInToken(connection: any): Promise<string> {
    if (!connection.refresh_token) {
        throw new Error('No refresh token available. User must re-authenticate.');
    }

    console.log('[LinkedIn] Attempting token refresh...');

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: connection.refresh_token,
            client_id: connection.integration.client_id,
            client_secret: connection.integration.client_secret,
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error('[LinkedIn] Token refresh failed:', response.status, errText);
        throw new Error(`LinkedIn token refresh failed (${response.status}). Please reconnect your LinkedIn account in Settings.`);
    }

    const data = await response.json();
    console.log('[LinkedIn] Token refresh succeeded');

    // Update tokens in Supabase
    const expiresAt = data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000).toISOString()
        : null;

    const { error: updateError } = await supabaseAdmin
        .from('social_connections')
        .update({
            access_token: data.access_token,
            refresh_token: data.refresh_token || connection.refresh_token,
            expires_at: expiresAt,
        })
        .eq('id', connection.id);

    if (updateError) {
        console.error('[LinkedIn] Failed to save refreshed token:', updateError);
    }

    return data.access_token;
}

/**
 * Upload an image to LinkedIn and return the image URN.
 * Uses the 3-step flow: initializeUpload → PUT binary → return URN.
 */
async function uploadImageToLinkedIn(
    accessToken: string,
    authorUrn: string,
    imageUrl: string
): Promise<string> {
    console.log('[LinkedIn] Starting image upload flow...');

    // Step 1: Initialize upload
    const initResponse = await fetch('https://api.linkedin.com/rest/images?action=initializeUpload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'LinkedIn-Version': LINKEDIN_API_VERSION,
            'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
            initializeUploadRequest: {
                owner: authorUrn,
            },
        }),
    });

    if (!initResponse.ok) {
        const errText = await initResponse.text();
        console.error('[LinkedIn] Image init upload failed:', initResponse.status, errText);
        throw new Error(`LinkedIn image upload initialization failed: ${errText}`);
    }

    const initData = await initResponse.json();
    const uploadUrl = initData.value.uploadUrl;
    const imageUrn = initData.value.image;
    console.log('[LinkedIn] Got upload URL and image URN:', imageUrn);

    // Step 2: Download the image and upload to LinkedIn
    const imageResponse = await axios({
        method: 'get',
        url: imageUrl,
        responseType: 'arraybuffer',
    });

    const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': imageResponse.headers['content-type'] || 'image/jpeg',
        },
        body: imageResponse.data,
    });

    if (!uploadResponse.ok) {
        const errText = await uploadResponse.text();
        console.error('[LinkedIn] Image binary upload failed:', uploadResponse.status, errText);
        throw new Error(`LinkedIn image upload failed: ${errText}`);
    }

    console.log('[LinkedIn] Image uploaded successfully');
    return imageUrn;
}

/**
 * Publish a post to LinkedIn. Supports text-only and text+image posts.
 */
export async function publishToLinkedIn({
    text,
    imageUrl,
    connectionId,
    userId, // fallback for single-tenant mode if connectionId is omitted, though we prefer connectionId now
}: {
    text: string;
    imageUrl?: string;
    connectionId?: string;
    userId?: string;
}) {
    console.log('[LinkedIn] ===== START publishToLinkedIn =====');
    if (connectionId) console.log('[LinkedIn] Using connection ID:', connectionId);
    else console.log('[LinkedIn] Using fallback userId:', userId);

    // 1. Fetch tokens from Supabase (include integration details for custom apps)
    
    let query = supabaseAdmin
        .from('social_connections')
        .select('*, integration:integration_id(client_id, client_secret)')
        .eq('platform', 'linkedin');
        
    if (connectionId) {
        query = query.eq('id', connectionId);
    } else if (userId) {
        query = query.eq('user_id', userId);
    } else {
        throw new Error("Must provide connectionId or userId");
    }

    const { data: connection, error: connectionError } = await query.single();

    if (connectionError || !connection) {
        console.error('[LinkedIn] No connection found!', connectionError);
        throw new Error(`No LinkedIn connection found for user ${userId}: ${connectionError?.message}`);
    }

    console.log('[LinkedIn] Connection found. ID:', connection.id);
    console.log('[LinkedIn] Has access_token:', !!connection.access_token);
    console.log('[LinkedIn] Has refresh_token:', !!connection.refresh_token);

    // 2. Check if token is expired and refresh if needed
    let accessToken = connection.access_token;
    const isExpired = connection.expires_at && new Date(connection.expires_at) < new Date();

    if (isExpired) {
        console.log('[LinkedIn] Token is expired, refreshing...');
        try {
            accessToken = await refreshLinkedInToken(connection);
        } catch (refreshError: unknown) {
            console.error('[LinkedIn] Token refresh failed:', refreshError instanceof Error ? refreshError.message : refreshError);
            throw refreshError;
        }
    }

    // 3. Build the author URN
    const platformUserId = connection.platform_user_id;
    if (!platformUserId) {
        throw new Error('LinkedIn member/organization ID not found. Please reconnect your LinkedIn account.');
    }

    // Support legacy format where just the ID was stored
    const authorUrn = platformUserId.startsWith('urn:li:') 
        ? platformUserId 
        : `urn:li:person:${platformUserId}`;

    console.log('[LinkedIn] Author URN:', authorUrn);

    // 4. Optionally upload image
    let imageUrn: string | undefined;
    if (imageUrl) {
        try {
            imageUrn = await uploadImageToLinkedIn(accessToken, authorUrn, imageUrl);
        } catch (imgError: unknown) {
            console.error('[LinkedIn] Image upload failed, posting text-only:', imgError instanceof Error ? imgError.message : imgError);
            // Fall back to text-only post
        }
    }

    // 5. Create the post
    const postBody: Record<string, unknown> = {
        author: authorUrn,
        commentary: text,
        visibility: 'PUBLIC',
        distribution: {
            feedDistribution: 'MAIN_FEED',
            targetEntities: [],
            thirdPartyDistributionChannels: [],
        },
        lifecycleState: 'PUBLISHED',
        isReshareDisabledByAuthor: false,
    };

    if (imageUrn) {
        postBody.content = {
            media: {
                id: imageUrn,
            },
        };
    }

    console.log('[LinkedIn] Posting to LinkedIn...');
    const postResponse = await fetch('https://api.linkedin.com/rest/posts', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'LinkedIn-Version': LINKEDIN_API_VERSION,
            'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(postBody),
    });

    if (!postResponse.ok) {
        const errText = await postResponse.text();
        console.error('[LinkedIn] Post failed:', postResponse.status, errText);
        throw new Error(`LinkedIn post failed (${postResponse.status}): ${errText}`);
    }

    // LinkedIn returns 201 with the post ID in the x-restli-id header
    const postId = postResponse.headers.get('x-restli-id');
    console.log('[LinkedIn] Post created successfully! Post ID:', postId);
    console.log('[LinkedIn] ===== END publishToLinkedIn SUCCESS =====');

    return { postId, success: true };
}
