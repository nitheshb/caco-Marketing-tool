import { NextResponse } from 'next/server';
import { getProviderConfig } from '@/lib/cross-app-providers';

/**
 * Initiates cross-app login by redirecting user to partner app's login page.
 * 
 * Query params:
 * - provider: The provider ID (e.g., 'redefine', 'hellostores')
 * - redirect: Where to redirect after successful login (default: /dashboard)
 * - callback: The callback URL for the partner app to redirect back to
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get('provider');
    const redirect = searchParams.get('redirect') || '/dashboard';
    const callback = searchParams.get('callback');

    if (!providerId) {
        return NextResponse.json({ error: 'Missing provider parameter' }, { status: 400 });
    }

    const config = getProviderConfig(providerId);
    if (!config) {
        return NextResponse.json({ error: `Unknown provider: ${providerId}` }, { status: 400 });
    }

    if (!config.loginUrl || !config.appUrl) {
        return NextResponse.json({ error: `Provider ${providerId} is not configured. Set ${providerId.toUpperCase()}_APP_URL env var.` }, { status: 500 });
    }

    // Build redirect URL to partner app's login page
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const callbackUrl = callback || `${appUrl}/api/auth/cross-app/callback`;

    const params = new URLSearchParams({
        app_id: 'caco',
        redirect_uri: callbackUrl,
        state: JSON.stringify({ provider: providerId, redirect }),
    });

    const loginUrl = `${config.loginUrl}?${params.toString()}`;

    return NextResponse.redirect(loginUrl);
}
