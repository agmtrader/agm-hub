// Does not provide admin access to Firebase, but instead is used to sync all users with Firebase
// See FirebaseAuthProvider for implementation

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyADSCcUmflApv3U1BDZnskcbgdBXXLAk1A",
    authDomain: "agm-datalake.firebaseapp.com",
    projectId: "agm-datalake",
    storageBucket: "agm-datalake.appspot.com",
    messagingSenderId: "571127175324",
    appId: "1:571127175324:web:02105fe799b088e6bab559"
};

// Initialize Firebase
getApps().length ? getApp() : initializeApp(firebaseConfig);

// This is used to sync Firebase Authentication with NextAuth on demand
const auth = getAuth()
export { auth }