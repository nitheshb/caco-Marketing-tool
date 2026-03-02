import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const h2Config = {
  apiKey: process.env.NEXT_PUBLIC_H2_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_H2_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_H2_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_H2_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_H2_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_H2_FIREBASE_APP_ID,
};

// Initialize HelloStores Firebase only if config is present
export const getHelloStoresApp = () => {
  if (!h2Config.apiKey) return null;
  
  const appName = 'hellostores-partner';
  const apps = getApps();
  const existingApp = apps.find(app => app.name === appName);
  
  return existingApp || initializeApp(h2Config, appName);
};

export const getHelloStoresAuth = () => {
  const app = getHelloStoresApp();
  return app ? getAuth(app) : null;
};

export const getHelloStoresDb = () => {
  const app = getHelloStoresApp();
  return app ? getFirestore(app) : null;
};
