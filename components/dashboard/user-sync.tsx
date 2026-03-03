'use client';

import { useEffect, useRef } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';

export function UserSync() {
    const { user, isLoaded } = useUser();
    const { getToken, isLoaded: authLoaded } = useAuth();
    const hasSyncCalled = useRef(false);

    useEffect(() => {
        const syncUser = async () => {
            if (!isLoaded || !authLoaded || !user || hasSyncCalled.current) return;

            try {
                hasSyncCalled.current = true;
                const token = await getToken();
                
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
    }, [user, isLoaded, authLoaded, getToken]);

    return null;
}
