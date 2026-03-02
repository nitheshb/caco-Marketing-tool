import { NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/auth-helpers';
import { ensureFirebaseUser } from '@/lib/auth-server-utils';

export async function POST(req: Request) {
    try {
        const { idToken, hellostoresUserData } = await req.json();

        if (!idToken) {
            return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
        }

        const h2ProjectId = process.env.NEXT_PUBLIC_H2_FIREBASE_PROJECT_ID;
        if (!h2ProjectId) {
            return NextResponse.json({ error: 'HelloStores Project ID not configured' }, { status: 500 });
        }

        // 1. Verify the HelloStores ID Token
        let decoded: any;
        try {
            decoded = await verifyFirebaseToken(idToken, h2ProjectId);
        } catch (err: any) {
            console.error('HelloStores token verification failed:', err);
            return NextResponse.json({ error: 'Invalid HelloStores token: ' + err.message }, { status: 401 });
        }

        const { email, name } = decoded;
        if (!email) {
            return NextResponse.json({ error: 'Token missing required field: email' }, { status: 400 });
        }

        // 2. Ensure Firebase user exists in Caco/VidMaxx project
        const { password, uid } = await ensureFirebaseUser(email, name || email.split('@')[0]);

        // 3. Return the credentials and HelloStores data to the client
        return NextResponse.json({
            email,
            password,
            uid,
            hellostoresUserData: hellostoresUserData || {},
            org_id: hellostoresUserData?.org_id || null,
            project_id: hellostoresUserData?.project_id || null,
            source_login: 'hellostores',
            redirect: '/dashboard'
        });

    } catch (error: any) {
        console.error('HelloStores verification error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
