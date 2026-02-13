import { auth as clerkAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');
        const userId = searchParams.get('state'); // clerk userId passed in state

        if (!code) {
            return new NextResponse("Missing code", { status: 400 });
        }

        const clientId = process.env.FACEBOOK_CLIENT_ID;
        const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/settings/social/callback/instagram`;

        // 1. Exchange code for short-lived access token
        const tokenRes = await fetch(
            `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`
        );
        const tokenData = await tokenRes.json();

        if (tokenData.error) {
            console.error("Facebook Token Error:", tokenData.error);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=facebook_token`);
        }

        const shortLivedToken = tokenData.access_token;

        // 2. Exchange for long-lived access token (60 days)
        const longLivedRes = await fetch(
            `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${shortLivedToken}`
        );
        const longLivedData = await longLivedRes.json();
        const accessToken = longLivedData.access_token;

        // 3. Get Pages and their linked Instagram Business Accounts
        const pagesRes = await fetch(
            `https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account{id,username,profile_picture_url},name&access_token=${accessToken}`
        );
        const pagesData = await pagesRes.json();

        const linkedPage = pagesData.data?.find((page: any) => page.instagram_business_account);

        if (!linkedPage) {
            console.error("No Instagram Business account linked to any Facebook Page");
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=no_instagram_linked`);
        }

        const igAccount = linkedPage.instagram_business_account;
        const profileName = igAccount.username;
        const profileImage = igAccount.profile_picture_url;

        // 4. Store in Supabase
        const { error: upsertError } = await supabaseAdmin
            .from('social_connections')
            .upsert({
                user_id: userId,
                platform: 'instagram',
                access_token: accessToken,
                // Meta long-lived tokens don't expire easily but we store the info if needed
                profile_name: profileName,
                profile_image: profileImage,
                created_at: new Date().toISOString()
            }, { onConflict: 'user_id,platform' });

        if (upsertError) {
            console.error("Supabase storage error:", upsertError);
            return new NextResponse("Failed to save connection", { status: 500 });
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?connected=instagram`);

    } catch (error: any) {
        console.error("Instagram Callback Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
