'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { syncUser } from '@/actions/user';

export function UserSync() {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            syncUser();
        }
    }, [loading, user]);

    return null;
}
