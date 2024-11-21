// Authentication for Firebase Admin SDK with NextAuth

import { initFirestore } from "@next-auth/firebase-adapter"
import admin from "firebase-admin"
 
// This is used to sync Firebase Admin Authentication with NextAuth
// AdminAuth can create login tokens

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