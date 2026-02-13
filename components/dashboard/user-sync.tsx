'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

export function UserSync() {
    const { user, isLoaded } = useUser();
    const hasSyncCalled = useRef(false);

    useEffect(() => {
        const syncUser = async () => {
            if (!isLoaded || !user || hasSyncCalled.current) return;

            try {
                hasSyncCalled.current = true;
                const response = await fetch('/api/user', {
                    method: 'POST',
                });

                if (!response.ok) {
                    console.error('Failed to sync user data');
                } else {
                    console.log('User data synchronized successfully');
                }
            } catch (error) {
                console.error('Error synchronizing user:', error);
            }
        };

        syncUser();
    }, [user, isLoaded]);

    return null; // This component doesn't render anything
}
