/**
 * Cross-App Login Provider Registry
 * 
 * To add a new partner app, simply add an entry to this array.
 * Each partner app needs to expose a /api/auth/partner-login endpoint.
 * 
 * Environment variables needed per provider:
 *   - <PROVIDER_ID>_APP_URL: The base URL of the partner app
 *   - <PROVIDER_ID>_SHARED_SECRET: A shared secret for JWT signing/verification
 */
export interface CrossAppProvider {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  icon?: string;  // Optional: path to icon or emoji
}

// Client-safe provider list (no secrets)
export const CROSS_APP_PROVIDERS: CrossAppProvider[] = [
  {
    id: 'hellostores',
    name: 'HelloStores',
    color: '#10b981',
    bgColor: '#ecfdf5',
  },
  {
    id: 'redefine',
    name: 'Redefine',
    color: '#6366f1',
    bgColor: '#eef2ff',
  },
];

// Server-side helper to get provider config with secrets
export function getProviderConfig(providerId: string) {
  const provider = CROSS_APP_PROVIDERS.find(p => p.id === providerId);
  if (!provider) return null;

  const envPrefix = providerId.toUpperCase();
  return {
    ...provider,
    loginUrl: process.env[`${envPrefix}_APP_URL`] + '/api/auth/partner-login',
    sharedSecret: process.env[`${envPrefix}_SHARED_SECRET`] || '',
    appUrl: process.env[`${envPrefix}_APP_URL`] || '',
  };
}
