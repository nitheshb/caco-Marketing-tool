import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');
        const stateBase64 = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Dynamically get the current host (works for ngrok or localhost)
        const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
        const protocol = host?.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;

        if (error) {
            console.error("Instagram OAuth Error:", error, errorDescription);
            return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=${encodeURIComponent(errorDescription || error)}`);
        }

        if (!code || !stateBase64) {
            return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=missing_params`);
        }

        let stateObj;
        try {
            const stateStr = Buffer.from(stateBase64, 'base64').toString('utf-8');
            stateObj = JSON.parse(stateStr);
        } catch (e) {
            console.error("Failed to decode state:", e);
            return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=invalid_state`);
        }

        const { userId, integrationId } = stateObj;

        if (!userId || !integrationId) {
            return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=invalid_state`);
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
            return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=invalid_integration`);
        }

        const clientId = integration.client_id;
        const clientSecret = integration.client_secret;
        const redirectUri = `${baseUrl}/api/settings/social/callback/instagram`;

        // 2. Exchange authorization code for access token using Facebook Graph API
        // With the Facebook App Secret, we MUST exchange the token at graph.facebook.com.
        // This is what grants the publishing permissions.
        const tokenParams = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code: code,
        });

        console.log("📌 Requesting token from graph.facebook.com...");
        const tokenRes = await fetch(
            `https://graph.facebook.com/v21.0/oauth/access_token?${tokenParams.toString()}`,
            { method: 'GET' }
        );
        const tokenData = await tokenRes.json();

        console.log("📌 Facebook API Token Response:", JSON.stringify({ ...tokenData, access_token: tokenData.access_token ? '[REDACTED]' : null }));

        if (tokenData.error_type || tokenData.error) {
            console.error("Instagram Token Error:", tokenData);
            return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=instagram_token_error&detail=${encodeURIComponent(tokenData.error_message || tokenData.error?.message || 'token_error')}`);
        }

        const accessToken = tokenData.access_token;

        // 3. Get the Facebook user info
        const meRes = await fetch(
            `https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${accessToken}`
        );
        const meData = await meRes.json();
        console.log("📌 Facebook Me:", JSON.stringify(meData));

        if (meData.error) {
            console.error("Facebook Me Error:", meData);
            return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=instagram_profile_error`);
        }

        // 4. Get Linked Instagram Business Account
        // To publish, we MUST use the deeply nested instagram_business_account.id attached to a Facebook Page
        console.log("📌 Fetching connected Pages and IG Business Accounts...");
        const igUserRes = await fetch(
            `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}&fields=instagram_business_account,name,id,access_token`
        );
        const igUserData = await igUserRes.json();
        console.log("📌 Pages Response:", JSON.stringify(igUserData));

        let igAccountId = '';
        let profileName = meData.name || 'Instagram Business';
        let profileImage = '';
        let pageAccessToken = accessToken; // Fall back to user token, but page token is better

        if (igUserData.data && igUserData.data.length > 0) {
            // Find the first page that actually has an attached IG account
            const page = igUserData.data.find((p: any) => p.instagram_business_account);
            
            if (page?.instagram_business_account) {
                igAccountId = page.instagram_business_account.id;
                
                // Pages API often returns a page-specific access token, which is much better for publishing
                if (page.access_token) {
                    pageAccessToken = page.access_token;
                    console.log("📌 Discovered Page Access Token - will use this for publishing");
                }

                console.log(`📌 Found IG Business Account! ID: ${igAccountId} (via Page: ${page.name})`);

                // Fetch Instagram business profile details directly using the IG account ID
                const igProfileRes = await fetch(
                    `https://graph.facebook.com/v21.0/${igAccountId}?fields=username,name,profile_picture_url&access_token=${pageAccessToken}`
                );
                const igProfileData = await igProfileRes.json();
                console.log("📌 IG Profile Data:", JSON.stringify(igProfileData));

                if (!igProfileData.error) {
                    profileName = igProfileData.username || igProfileData.name || profileName;
                    profileImage = igProfileData.profile_picture_url || '';
                }
            } else {
                console.error("📌 Error: Found Facebook Pages, but NONE of them have an Instagram Business Account linked.");
                return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=no_ig_business_account`);
            }
        } else {
            console.error("📌 Error: User has no Facebook Pages. Publishing requires an IG account linked to an FB Page.");
            return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=no_facebook_pages`);
        }

        if (!igAccountId) {
            return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=no_ig_account_found`);
        }

        // 5. Store in Supabase
        // Notice we save 'pageAccessToken' which has the required Page/Publish scopes
        const { error: upsertError } = await supabaseAdmin
            .from('social_connections')
            .upsert({
                user_id: userId,
                integration_id: integrationId,
                platform: 'instagram',
                access_token: pageAccessToken, 
                profile_name: profileName,
                profile_image: profileImage,
                platform_user_id: igAccountId,
                internal_id: igAccountId,
                created_at: new Date().toISOString()
            }, { onConflict: 'user_id,platform,platform_user_id' });

        if (upsertError) {
            console.error("Supabase storage error:", upsertError);
            return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=database_error`);
        }

        return NextResponse.redirect(`${baseUrl}/dashboard/settings?connected=instagram`);

    } catch (error: any) {
        console.error("Instagram Callback Error:", error);
        const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        return NextResponse.redirect(`${protocol}://${host}/dashboard/settings?error=internal_error`);
    }
}