'use client';

import { useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebase';

export function UserSync() {
    const hasSyncCalled = useRef(false);

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user || hasSyncCalled.current) return;

            try {
                hasSyncCalled.current = true;
                const token = await user.getIdToken();

                // Check if we have partner auth info from a fresh cross-app login
                const partnerInfoStr = localStorage.getItem('partner_auth_info');
                let body = {};
                if (partnerInfoStr) {
                    try {
                        body = JSON.parse(partnerInfoStr);
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
        });

        return () => unsubscribe();
    }, []);

    return null;
}