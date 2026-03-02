import { getAuthUser } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { userId } = await getAuthUser(req);
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const clientKey = process.env.TIKTOK_CLIENT_KEY;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/settings/social/callback/tiktok`;

        const scopes = [
            'user.info.basic',
            'video.upload',
            'video.publish'
        ].join(',');

        // TikTok V2 Authorize URL
        const csrfState = userId; // Using userId as state for simple verification
        const url = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scopes}&response_type=code&redirect_uri=${redirectUri}&state=${csrfState}`;

        return NextResponse.redirect(url);

    } catch (error: any) {
        console.error("TikTok Connect Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
