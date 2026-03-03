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
                await fetch('/api/user', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });
            } catch (e) {
                console.error('UserSync error:', e);
            }
        });
        return () => unsubscribe();
    }, []);

    return null;
}