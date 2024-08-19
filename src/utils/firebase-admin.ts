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

const a = adminAuth.updateUser('sT63SUHnA0zGFwvthUAH', {'email':'admin@agmtechnology.com', 'displayName':'Admin', 'emailVerified':true, 'disabled':false})
console.log(a)

export { firestoreAdmin, adminAuth }