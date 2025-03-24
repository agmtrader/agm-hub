import admin from "firebase-admin"
import { initFirestore } from "@next-auth/firebase-adapter"

const secret = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
}

// This is used to sync Firebase services with our backend manually
// AdminAuth can create login tokens and sync user information from/to Firebase Authentication service
let firebase
if (!admin.apps.length) {
    firebase = admin.initializeApp({
        credential: admin.credential.cert(secret)
    })
}
const firebaseAdminAuth = admin.auth(firebase)

// Firestore admin gives admin access to Firestore database
// This is used to sync user data with our database and NextAuth using the FirestoreAdapter
const firestore = initFirestore({
    credential: admin.credential.cert(secret)
})

export { firestore, firebaseAdminAuth }