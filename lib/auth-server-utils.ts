const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;

/**
 * Ensures a Firebase user exists for the given email on Caco's (VidMaxx) Firebase project.
 * Creates the user if they don't exist, using a deterministic password.
 * Returns the deterministic password so the client can sign in via the SDK.
 */
export async function ensureFirebaseUser(email: string, displayName: string): Promise<{ password: string, uid: string }> {
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
        return { password, uid: signInData.localId }; // User exists
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

    return { password, uid: signUpData.localId };
}
