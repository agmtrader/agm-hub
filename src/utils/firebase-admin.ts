// Authentication for Firebase Admin SDK with NextAuth

import { initFirestore } from "@next-auth/firebase-adapter"
import admin from "firebase-admin"
 
// This is used to sync Firebase Admin with the backend

// AdminAuth can create login tokens and get user information from Firebase Authentication service
// Firestore admin is passed to the FirestoreAdapter for NextAuth on the backend, gives admin access to Firestore database

let firebaseAdmin
if (!admin.apps.length) {
        firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
        }),
    })
}
const adminAuth = admin.auth(firebaseAdmin)

// This is used to sync Firestore Admin Authentication with NextAuth using the FirestoreAdapter
const firestoreAdmin = initFirestore({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
})

export { firestoreAdmin, adminAuth }