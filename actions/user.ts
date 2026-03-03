'use server'

// User sync is now handled client-side via components/user-sync.tsx using Firebase auth.
// This file is kept for backwards compatibility but the primary sync path
// goes through /api/user route with a Firebase ID token.
export async function syncUser() {
    // No-op: sync is performed by UserSync component using Firebase onAuthStateChanged
}
