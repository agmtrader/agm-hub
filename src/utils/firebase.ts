// Does not provide admin access to Firebase, but instead is used to sync all users with Firebase
// See FirebaseAuthProvider for implementation

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
getApps().length ? getApp() : initializeApp(firebaseConfig);

// This is used to sync Firebase Authentication with NextAuth on demand
const auth = getAuth()
export { auth }