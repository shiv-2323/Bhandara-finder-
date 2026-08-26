import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app =
  getApps().length === 0
    ? initializeApp({
        apiKey: firebaseConfig.apiKey || '',
        authDomain: firebaseConfig.authDomain || '',
        projectId: firebaseConfig.projectId || '',
        storageBucket: firebaseConfig.storageBucket || '',
        messagingSenderId: firebaseConfig.messagingSenderId || '',
        appId: firebaseConfig.appId || '',
      })
    : getApp();

// Suppress non-critical backend connection warnings in browser logs
try {
  setLogLevel('silent');
} catch {}

export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

export const auth = getAuth(app);

export default app;



