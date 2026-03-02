'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getRedefineAuth, getRedefineDb } from '@/lib/firebase-redefine';
import { Video, Mail, Lock, ArrowRight, Loader2, X } from 'lucide-react';

interface RedefineLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (email: string, password: string, extraData?: any) => void;
}

export function RedefineLoginModal({ isOpen, onClose, onSuccess }: RedefineLoginModalProps) {
    const [mode, setMode] = useState<'options' | 'email'>('options');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleRedefineGoogleLogin = async () => {
        const auth = getRedefineAuth();
        if (!auth) {
            setError('Redefine Login is not configured.');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            // Fetch Redefine User Collection data
            const db = getRedefineDb();
            let redefineUserData = {};
            if (db) {
                try {
                    const docRef = doc(db, 'users', result.user.uid);
                    const userDoc = await getDoc(docRef);
                    if (userDoc.exists()) {
                        redefineUserData = userDoc.data();
                        console.log('Fetched Redefine User Data:', redefineUserData);
                    }
                } catch (err) {
                    console.warn('Failed to fetch Redefine user document:', err);
                }
            }

            const verifyRes = await fetch('/api/auth/redefine/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken, redefineUserData }),
            });

            const data = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(data.error || 'Verification failed');

            onSuccess(data.email, data.password, { 
                org_id: data.org_id, 
                project_id: data.project_id, 
                source_login: data.source_login 
            });
        } catch (err: any) {
            console.error('Redefine Google Login Error:', err);
            setError(err.message || 'Redefine Google sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRedefineEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const auth = getRedefineAuth();
        if (!auth) {
            setError('Redefine Login is not configured.');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await result.user.getIdToken();

            // Fetch Redefine User Collection data
            const db = getRedefineDb();
            let redefineUserData = {};
            if (db) {
                try {
                    const docRef = doc(db, 'users', result.user.uid);
                    const userDoc = await getDoc(docRef);
                    if (userDoc.exists()) {
                        redefineUserData = userDoc.data();
                        console.log('Fetched Redefine User Data (Email):', redefineUserData);
                    }
                } catch (err) {
                    console.warn('Failed to fetch Redefine user document:', err);
                }
            }

            const verifyRes = await fetch('/api/auth/redefine/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken, redefineUserData }),
            });

            const data = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(data.error || 'Verification failed');

            onSuccess(data.email, data.password, { 
                org_id: data.org_id, 
                project_id: data.project_id, 
                source_login: data.source_login 
            });
        } catch (err: any) {
            console.error('Redefine Email Login Error:', err);
            setError(err.message || 'Invalid Redefine email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                <button 
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                        <Video className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Login with Redefine</span>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-xs text-red-100 italic">
                        {error}
                    </div>
                )}

                {mode === 'options' ? (
                    <div className="space-y-3">
                        <button
                            onClick={handleRedefineGoogleLogin}
                            disabled={loading}
                            className="w-full h-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continue with Redefine Google
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => setMode('email')}
                            disabled={loading}
                            className="w-full h-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <Mail className="h-5 w-5" />
                            Login with Redefine Email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleRedefineEmailLogin} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <input
                                type="email"
                                placeholder="Redefine Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <input
                                type="password"
                                placeholder="Redefine Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Login <ArrowRight className="h-4 w-4" /></>}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('options')}
                            className="w-full text-zinc-500 hover:text-white text-xs text-center transition-colors"
                        >
                            Back to other Redefine options
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
