import { google } from 'googleapis';
import { auth as clerkAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await clerkAuth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/settings/social/callback/youtube`
        );

        const scopes = [
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/userinfo.profile',
            'openid',
            'https://www.googleapis.com/auth/userinfo.email'
        ];

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent', // Force consent screen to ensure refresh token
            state: userId // Pass userId to verify in callback
        });

        return NextResponse.redirect(url);

    } catch (error: any) {
        console.error("YouTube Connect Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
