'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  getIdToken: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Set/clear session cookie for middleware
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax`;
      } else {
        document.cookie = '__session=; path=/; max-age=0';
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await firebaseSignOut(auth);
    document.cookie = '__session=; path=/; max-age=0';
    window.location.href = '/sign-in'; // Redirect using window.location to strictly clear all client state
  };

  const getIdToken = async () => {
    if (!user) return null;
    return user.getIdToken(true);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
