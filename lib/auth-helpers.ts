import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface AuthUser {
  userId: string;
  email: string | undefined;
  name: string | undefined;
}

// Cache for Google's public keys (refreshed every hour)
let cachedKeys: Record<string, string> = {};
let keysFetchedAt = 0;

/**
 * Fetches Google's public certificates for verifying Firebase ID tokens.
 * These are the same keys Firebase Admin SDK uses internally.
 */
async function getGooglePublicKeys(): Promise<Record<string, string>> {
  const now = Date.now();
  // Refresh keys every hour
  if (Object.keys(cachedKeys).length > 0 && now - keysFetchedAt < 3600000) {
    return cachedKeys;
  }

  const response = await fetch(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  );
  cachedKeys = await response.json();
  keysFetchedAt = now;
  return cachedKeys;
}

/**
 * Verifies a Firebase ID token WITHOUT the Admin SDK.
 * Uses Google's published public certificates to verify the JWT signature.
 */
async function verifyFirebaseToken(token: string): Promise<any> {
  // Decode the token header to get the key ID (kid)
  const decodedHeader = jwt.decode(token, { complete: true });
  if (!decodedHeader || typeof decodedHeader === 'string') {
    throw new Error('Invalid token format');
  }

  const kid = decodedHeader.header.kid;
  if (!kid) {
    throw new Error('Token missing key ID');
  }

  // Get Google's public keys
  const publicKeys = await getGooglePublicKeys();
  const publicKey = publicKeys[kid];

  if (!publicKey) {
    throw new Error('No matching public key found');
  }

  // Verify the token signature and claims
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const decoded = jwt.verify(token, publicKey, {
    algorithms: ['RS256'],
    audience: projectId,
    issuer: `https://securetoken.google.com/${projectId}`,
  });

  return decoded;
}

/**
 * Server-side auth helper for API routes.
 * Extracts Firebase ID token from Authorization header or __session cookie,
 * verifies it using Google's public keys, and returns the user info.
 * 
 * NO Firebase Admin SDK required.
 */
export async function getAuthUser(request?: Request): Promise<AuthUser> {
  let token: string | undefined;

  // 1. Try Authorization header first
  if (request) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split('Bearer ')[1];
    }
  }

  // 2. Fallback to __session cookie (for server actions / SSR)
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('__session')?.value;
  }

  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const decoded = await verifyFirebaseToken(token);
    return {
      userId: decoded.user_id || decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };
  } catch (error) {
    throw new Error('Unauthorized');
  }
}
