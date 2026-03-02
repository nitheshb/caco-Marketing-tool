import { NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/auth-helpers';
import { ensureFirebaseUser } from '@/lib/auth-server-utils';

export async function POST(req: Request) {
    try {
        const { idToken, redefineUserData } = await req.json();

        if (!idToken) {
            return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
        }

        const r2ProjectId = process.env.NEXT_PUBLIC_R2_FIREBASE_PROJECT_ID;
        if (!r2ProjectId) {
            return NextResponse.json({ error: 'Redefine Project ID not configured' }, { status: 500 });
        }

        // 1. Verify the Redefine ID Token
        let decoded: any;
        try {
            decoded = await verifyFirebaseToken(idToken, r2ProjectId);
        } catch (err: any) {
            console.error('Redefine token verification failed:', err);
            return NextResponse.json({ error: 'Invalid Redefine token: ' + err.message }, { status: 401 });
        }

        const { email, name } = decoded;
        if (!email) {
            return NextResponse.json({ error: 'Token missing required field: email' }, { status: 400 });
        }

        // 2. Ensure Firebase user exists in Caco/VidMaxx project
        const { password, uid } = await ensureFirebaseUser(email, name || email.split('@')[0]);

        // 3. Return the credentials and Redefine data to the client
        return NextResponse.json({
            email,
            password,
            uid,
            redefineUserData: redefineUserData || {},
            org_id: redefineUserData?.orgId || null,
            project_id: redefineUserData?.project_id || null,
            source_login: 'redefine',
            redirect: '/dashboard'
        });

    } catch (error: any) {
        console.error('Redefine verification error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
