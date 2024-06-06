// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyADSCcUmflApv3U1BDZnskcbgdBXXLAk1A",
    authDomain: "agm-datalake.firebaseapp.com",
    projectId: "agm-datalake",
    storageBucket: "agm-datalake.appspot.com",
    messagingSenderId: "571127175324",
    appId: "1:571127175324:web:02105fe799b088e6bab559"
};

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase);