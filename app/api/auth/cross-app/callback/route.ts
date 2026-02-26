import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getProviderConfig } from '@/lib/cross-app-providers';

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;

/**
 * Ensures a Firebase user exists for the given email on Caco's Firebase project.
 * Creates the user if they don't exist, using a deterministic password.
 * Returns the deterministic password so the client can sign in via the SDK.
 */
async function ensureFirebaseUser(email: string, displayName: string): Promise<string> {
    const password = `cross_app_${Buffer.from(email).toString('base64')}`;

    // Try to sign in first — if user exists, we're done
    const signInRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
    );

    const signInData = await signInRes.json();
    if (signInData.localId) {
        return password; // User exists
    }

    // User doesn't exist — create one
    const signUpRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, displayName, returnSecureToken: true }),
        }
    );

    const signUpData = await signUpRes.json();
    if (signUpData.error) {
        throw new Error(signUpData.error.message || 'Failed to create user');
    }

    return password;
}

/**
 * Handles callback from partner app after user authentication.
 * 
 * Flow:
 * 1. Verifies the JWT signed by the partner app
 * 2. Creates Firebase user on Caco's project (if not exists)
 * 3. Redirects to sign-in page with email + password
 * 4. Sign-in page calls signInWithEmailAndPassword → triggers onAuthStateChanged → UserSync → Supabase
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const stateStr = searchParams.get('state');

    if (!token || !stateStr) {
        return NextResponse.json({ error: 'Missing token or state' }, { status: 400 });
    }

    let state: { provider: string; redirect: string };
    try {
        state = JSON.parse(stateStr);
    } catch {
        return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
    }

    const config = getProviderConfig(state.provider);
    if (!config) {
        return NextResponse.json({ error: `Unknown provider: ${state.provider}` }, { status: 400 });
    }

    if (!config.sharedSecret) {
        return NextResponse.json({ error: `Shared secret not configured for ${state.provider}` }, { status: 500 });
    }

    // Verify the JWT from the partner app
    let decoded: any;
    try {
        decoded = jwt.verify(token, config.sharedSecret);
    } catch (err) {
        console.error('Cross-app token verification failed:', err);
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { email, name } = decoded;

    if (!email) {
        return NextResponse.json({ error: 'Token missing required field: email' }, { status: 400 });
    }

    try {
        // Ensure Firebase user exists and get the deterministic password
        const password = await ensureFirebaseUser(email, name || email.split('@')[0]);

        // Redirect to sign-in page with credentials
        // The sign-in page will call signInWithEmailAndPassword on the CLIENT SDK
        // This triggers onAuthStateChanged → UserSync → Supabase user creation
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const redirectUrl = new URL('/sign-in', appUrl);
        redirectUrl.searchParams.set('crossAppEmail', email);
        redirectUrl.searchParams.set('crossAppPass', password);
        redirectUrl.searchParams.set('redirect', state.redirect || '/dashboard');

        return NextResponse.redirect(redirectUrl.toString());

    } catch (error: any) {
        console.error('Cross-app callback error:', error);
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        return NextResponse.redirect(`${appUrl}/sign-in?error=cross_app_failed`);
    }
}
