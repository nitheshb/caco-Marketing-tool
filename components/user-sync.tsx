'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { syncUser } from '@/actions/user';

export function UserSync() {
    const { user, isLoaded, isSignedIn } = useUser();

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            syncUser();
        }
    }, [isLoaded, isSignedIn, user]);

    return null;
}
