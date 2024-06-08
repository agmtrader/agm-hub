// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyADSCcUmflApv3U1BDZnskcbgdBXXLAk1A",
    authDomain: "agm-datalake.firebaseapp.com",
    projectId: "agm-datalake",
    storageBucket: "agm-datalake.appspot.com",
    messagingSenderId: "571127175324",
    appId: "1:571127175324:web:02105fe799b088e6bab559"
};

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore/lite';
import { getFunctions } from "firebase/functions"

// Initialize Firebase
const firebase = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore(firebase); 
const functions = getFunctions(firebase)

export {db, auth, functions}