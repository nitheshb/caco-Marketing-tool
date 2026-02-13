'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { syncUser } from '@/actions/user';

export function UserSync() {
    const { isSignedIn, isLoaded } = useUser();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            syncUser();
        }
    }, [isLoaded, isSignedIn]);

    return null;
}
