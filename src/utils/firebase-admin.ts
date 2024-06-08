import { initFirestore } from "@next-auth/firebase-adapter"
import admin from "firebase-admin"
 
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

const firestoreAdmin = initFirestore({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
})

const adminAuth = admin.auth(firebaseAdmin)

export { firestoreAdmin, adminAuth }