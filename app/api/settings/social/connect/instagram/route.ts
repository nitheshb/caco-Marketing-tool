import { auth as clerkAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await clerkAuth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const clientId = process.env.FACEBOOK_CLIENT_ID;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/settings/social/callback/instagram`;

        const scopes = [
            'instagram_basic',
            'instagram_content_publish',
            'pages_show_list',
            'pages_read_engagement',
            'public_profile'
        ].join(',');

        const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${userId}&response_type=code`;

        return NextResponse.redirect(url);

    } catch (error: any) {
        console.error("Instagram Connect Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
