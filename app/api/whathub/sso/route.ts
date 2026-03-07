import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

const WHATHUB_URL = process.env.WHATHUB_URL || 'http://146.190.113.104:8080';
const WHATHUB_SSO_SECRET = process.env.WHATHUB_SSO_SECRET || '';

export async function GET(request: NextRequest) {
    if (!WHATHUB_SSO_SECRET) {
        return NextResponse.json(
            { error: 'SSO not configured. Set WHATHUB_SSO_SECRET in .env.local' },
            { status: 503 }
        );
    }

    // The auth context stores a Firebase ID token in the __session cookie
    const sessionCookie = request.cookies.get('__session')?.value;

    if (!sessionCookie) {
        // Not logged in
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    let userEmail: string | null = null;

    try {
        // Firebase ID token is a JWT — decode (not verify) to extract the email claim
        // We trust it because the middleware already guards all /api/* routes
        const parts = sessionCookie.split('.');
        if (parts.length === 3) {
            // Add padding if needed
            const payload = JSON.parse(
                Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
            );
            userEmail = payload.email || null;
        }
    } catch {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (!userEmail) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Generate a short-lived signed JWT (30 seconds) for Whathub SSO
    const secret = new TextEncoder().encode(WHATHUB_SSO_SECRET);
    const token = await new jose.SignJWT({ email: userEmail })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('caco-marketing-tool')
        .setExpirationTime('30s')
        .sign(secret);

    // Redirect the browser to the Whathub SSO endpoint
    // Whathub validates the token, sets its own auth cookies, and redirects to dashboard
    const whathubSSOUrl = `${WHATHUB_URL}/api/auth/caco-sso?token=${encodeURIComponent(token)}`;
    return NextResponse.redirect(whathubSSOUrl);
}
