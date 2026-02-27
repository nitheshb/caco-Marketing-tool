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
                
                // Check if we have partner auth info from a fresh login
                const partnerInfoStr = localStorage.getItem('partner_auth_info');
                let body = {};
                if (partnerInfoStr) {
                    try {
                        body = JSON.parse(partnerInfoStr);
                        // Only use this info once
                        localStorage.removeItem('partner_auth_info');
                    } catch (e) {
                        console.error('Failed to parse partner auth info:', e);
                    }
                }

                const response = await fetch('/api/user', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
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
