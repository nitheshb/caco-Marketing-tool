import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const r2Config = {
  apiKey: process.env.NEXT_PUBLIC_R2_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_R2_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_R2_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_R2_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_R2_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_R2_FIREBASE_APP_ID,
};

// Initialize Redefine Firebase only if config is present
export const getRedefineApp = () => {
  if (!r2Config.apiKey) return null;
  
  const appName = 'redefine-partner';
  const apps = getApps();
  const existingApp = apps.find(app => app.name === appName);
  
  return existingApp || initializeApp(r2Config, appName);
};

export const getRedefineAuth = () => {
  const app = getRedefineApp();
  return app ? getAuth(app) : null;
};

export const getRedefineDb = () => {
  const app = getRedefineApp();
  return app ? getFirestore(app) : null;
};
