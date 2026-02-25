import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');
        const state = searchParams.get('state'); // userId passed from connect route
        const error = searchParams.get('error');

        if (error) {
            console.error("LinkedIn OAuth error:", error, searchParams.get('error_description'));
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings?error=linkedin_denied`
            );
        }

        if (!code || !state) {
            return new NextResponse("Missing code or state", { status: 400 });
        }

        let stateObj;
        try {
            const decodedState = Buffer.from(state, 'base64').toString('ascii');
            stateObj = JSON.parse(decodedState);
        } catch (e) {
            console.error("Failed to decode state:", e);
            return new NextResponse("Invalid state parameter", { status: 400 });
        }

        const { userId, integrationId } = stateObj;

        if (!userId || !integrationId) {
            return new NextResponse("Missing userId or integrationId in state", { status: 400 });
        }

        // Fetch custom app credentials
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

        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/settings/social/callback/linkedin`;
        console.log("[LinkedIn] Callback hit. Exchanging code for tokens...");

        // 1. Exchange code for tokens
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                client_id: integration.client_id,
                client_secret: integration.client_secret,
            }),
        });

        if (!tokenResponse.ok) {
            const errBody = await tokenResponse.text();
            console.error("[LinkedIn] Token exchange failed:", tokenResponse.status, errBody);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings?error=linkedin_token`
            );
        }

        const tokenData = await tokenResponse.json();
        console.log("[LinkedIn] Token exchange succeeded. Has access_token:", !!tokenData.access_token);
        console.log("[LinkedIn] Has refresh_token:", !!tokenData.refresh_token);
        console.log("[LinkedIn] expires_in:", tokenData.expires_in);

        // 2. Fetch user profile via OpenID Connect userinfo endpoint
        // The `sub` field from userinfo IS the LinkedIn member ID needed for author URN
        const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        let profileName = 'LinkedIn User';
        let profileImage = '';
        let linkedinId = '';

        if (userInfoResponse.ok) {
            const userInfo = await userInfoResponse.json();
            profileName = userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim() || 'LinkedIn User';
            profileImage = userInfo.picture || '';
            linkedinId = userInfo.sub || ''; // OpenID Connect `sub` = LinkedIn member ID
            console.log("[LinkedIn] User profile fetched:", profileName, "| Member ID:", linkedinId);
        } else {
            console.warn("[LinkedIn] Failed to fetch userinfo, using defaults");
        }

        // 3. Calculate expiry
        const expiresAt = tokenData.expires_in
            ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
            : null;

        // 4. Store Personal Profile in Supabase
        const { error: upsertError } = await supabaseAdmin
            .from('social_connections')
            .upsert({
                user_id: userId,
                integration_id: integrationId,
                platform: 'linkedin',
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token || null,
                expires_at: expiresAt,
                profile_name: profileName,
                profile_image: profileImage,
                platform_user_id: `urn:li:person:${linkedinId}`, // Store full URN for routing
                internal_id: linkedinId,
                created_at: new Date().toISOString(),
            }, { onConflict: 'user_id,platform,platform_user_id' });

        if (upsertError) {
            console.error("[LinkedIn] Supabase upsert error (Personal):", upsertError);
            // Optionally continue to pages even if personal profile fails
        } else {
             console.log("[LinkedIn] Personal Connection saved successfully");
        }

        // 5. Fetch Managed Organizations (Pages)
        try {
            const orgAclsResponse = await fetch('https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR', {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                    'X-Restli-Protocol-Version': '2.0.0'
                }
            });

            if (orgAclsResponse.ok) {
                const orgAclsData = await orgAclsResponse.json();
                const orgAcls = orgAclsData.elements || [];
                
                for (const acl of orgAcls) {
                    const orgUrn = acl.organization; // e.g., "urn:li:organization:123456"
                    
                    // Fetch Organization details to get the name
                    const orgDetailsResponse = await fetch(`https://api.linkedin.com/v2/organizations/${orgUrn.split(':').pop()}`, {
                         headers: {
                            Authorization: `Bearer ${tokenData.access_token}`,
                            'X-Restli-Protocol-Version': '2.0.0'
                        }
                    });

                    let orgName = `LinkedIn Page (${orgUrn.split(':').pop()})`;
                    if (orgDetailsResponse.ok) {
                         const orgDetails = await orgDetailsResponse.json();
                         // The localizedName property contains the page's name
                         if (orgDetails.localizedName) {
                             orgName = orgDetails.localizedName;
                         }
                    }

                    // Save Organization Page Connection
                    const { error: orgUpsertError } = await supabaseAdmin
                        .from('social_connections')
                        .upsert({
                            user_id: userId,
                            integration_id: integrationId,
                            platform: 'linkedin', // We keep it as linkedin for UI simplicity, distinguish by platform_user_id URN format
                            access_token: tokenData.access_token,
                            refresh_token: tokenData.refresh_token || null,
                            expires_at: expiresAt,
                            profile_name: `${orgName} (Page)`,
                            platform_user_id: orgUrn, // Store the org URN to route posts correctly
                            internal_id: orgUrn.split(':').pop(),
                            created_at: new Date().toISOString(),
                        }, { onConflict: 'user_id,platform,platform_user_id' });

                        if (orgUpsertError) {
                            console.error(`[LinkedIn] Failed to save Organization ${orgUrn}:`, orgUpsertError);
                        } else {
                            console.log(`[LinkedIn] Saved Organization Page: ${orgName}`);
                        }
                }

            } else {
                console.warn("[LinkedIn] Failed to fetch organization ACLs. Error:", await orgAclsResponse.text());
            }
        } catch (orgFetchErr) {
             console.error("[LinkedIn] Error executing Organization ACL fetch:", orgFetchErr);
        }

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings?connected=linkedin`
        );

    } catch (error: unknown) {
        console.error("[LinkedIn] Callback error:", error instanceof Error ? error.message : error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings?error=linkedin_unknown`
        );
    }
}
