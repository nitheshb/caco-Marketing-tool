'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';

export function UserSync() {
    const { user, loading, getIdToken } = useAuth();
    const hasSyncCalled = useRef(false);

    useEffect(() => {
        const syncUser = async () => {
            if (loading || !user || hasSyncCalled.current) return;

            try {
                hasSyncCalled.current = true;
                const token = await getIdToken();
                const response = await fetch('/api/user', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
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
    }, [user, loading, getIdToken]);

    return null;
}
