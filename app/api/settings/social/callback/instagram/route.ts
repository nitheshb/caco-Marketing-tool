import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');
        const stateBase64 = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
            console.error("Instagram OAuth Error:", error, errorDescription);
            return NextResponse.redirect(new URL(`/dashboard/settings?error=${encodeURIComponent(errorDescription || error)}`, req.url));
        }

        if (!code || !stateBase64) {
            return NextResponse.redirect(new URL('/dashboard/settings?error=missing_params', req.url));
        }

        let stateObj;
        try {
            const stateStr = Buffer.from(stateBase64, 'base64').toString('utf-8');
            stateObj = JSON.parse(stateStr);
        } catch (e) {
            console.error("Failed to decode state:", e);
            return NextResponse.redirect(new URL('/dashboard/settings?error=invalid_state', req.url));
        }

        const { userId, integrationId } = stateObj;

        if (!userId || !integrationId) {
            return NextResponse.redirect(new URL('/dashboard/settings?error=invalid_state', req.url));
        }

        // 1. Fetch custom app credentials
        const { data: integration, error: intError } = await supabaseAdmin
            .from('social_integrations')
            .select('client_id, client_secret')
            .eq('id', integrationId)
            .eq('user_id', userId)
            .single();

        if (intError || !integration) {
            console.error("Integration fetch error", intError);
            return NextResponse.redirect(new URL('/dashboard/settings?error=invalid_integration', req.url));
        }

        const clientId = integration.client_id;
        const clientSecret = integration.client_secret;
        
        // Dynamically get the current host (works for ngrok or localhost)
        const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
        const protocol = host?.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;
        const redirectUri = `${baseUrl}/api/settings/social/callback/instagram`;

        // 2. Exchange code for short-lived access token
        const formData = new FormData();
        formData.append('client_id', clientId);
        formData.append('client_secret', clientSecret);
        formData.append('grant_type', 'authorization_code');
        formData.append('redirect_uri', redirectUri);
        formData.append('code', code);

        const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            body: formData,
        });
        const tokenData = await tokenRes.json();

        if (tokenData.error_type) {
            console.error("Instagram Token Error:", tokenData);
            return NextResponse.redirect(new URL('/dashboard/settings?error=instagram_token_error', req.url));
        }

        const shortLivedToken = tokenData.access_token;

        // 3. Exchange for long-lived access token
        const longLivedRes = await fetch(
            `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&access_token=${shortLivedToken}`
        );
        const longLivedData = await longLivedRes.json();
        
        if (longLivedData.error) {
             console.error("Instagram Long Lived Token Error:", longLivedData);
             return NextResponse.redirect(new URL('/dashboard/settings?error=instagram_token_exchange_error', req.url));
        }

        const accessToken = longLivedData.access_token;

        // 4. Get User Profile Info
        const profileRes = await fetch(
            `https://graph.instagram.com/v21.0/me?fields=user_id,username,name,profile_picture_url&access_token=${accessToken}`
        );
        const profileData = await profileRes.json();

        if (profileData.error) {
            console.error("Instagram Profile Error:", profileData);
            return NextResponse.redirect(new URL('/dashboard/settings?error=instagram_profile_error', req.url));
        }

        const igAccountId = profileData.user_id;
        const profileName = profileData.username;
        const profileImage = profileData.profile_picture_url || '';

        // 5. Store in Supabase
        const { error: upsertError } = await supabaseAdmin
            .from('social_connections')
            .upsert({
                user_id: userId,
                integration_id: integrationId,
                platform: 'instagram',
                access_token: accessToken,
                profile_name: profileName,
                profile_image: profileImage,
                platform_user_id: igAccountId,
                internal_id: igAccountId,
                created_at: new Date().toISOString()
            }, { onConflict: 'user_id,platform,platform_user_id' });

        if (upsertError) {
            console.error("Supabase storage error:", upsertError);
            return NextResponse.redirect(new URL('/dashboard/settings?error=database_error', req.url));
        }

        return NextResponse.redirect(new URL('/dashboard/settings?connected=instagram', req.url));

    } catch (error: any) {
        console.error("Instagram Callback Error:", error);
        return NextResponse.redirect(new URL('/dashboard/settings?error=internal_error', req.url));
    }
}
