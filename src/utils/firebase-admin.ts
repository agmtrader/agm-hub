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
            projectId: "agm-datalake",
            clientEmail: "firebase-adminsdk-viaos@agm-datalake.iam.gserviceaccount.com",
            privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDSIHgL/Zje8gOo\nC5smn77diKLFFQ54fs9cctfLPwnxSE/8PmO58sGog65+1pz35YQx4Mwu9+ZtT03P\nWW+oPpcAmT4+BYNH1GojxzotiabDLzTouMoecr4CWFhnovyLU52JSCC8QpFhx1eP\nR8FhR6BjuWUpzG5xcyhjnxLG000Gu/1YI6G1t5QSaYYHLuw2JTFRfjOfGEF11N9W\nUKbtvLcL/YDa1KjzRKOLa+GZdkyFK7KNTUAG9Zxa57yPcgvzTf866bxtmtwE7MO1\nMB6i+3Nh6EnLJabqJ6AEx/ttlhdnBUeN83cwNIsqV+Xhpv1uTG8XKtFhn7/e99Pz\nxIVMfAclAgMBAAECggEAUsC6xm4fUF4blojLl5B+CJ0RDXDXfBjk7VHFLqQq9D04\nUuz3NXonTohdplI7C132i/YuM6kptI7w4+IjGS1dJr0zSBW/uAAttN13SgvWAzSK\nL8TmxMsHjcDhQB9uOii5+CDR05Kb0thA4Yqu2/LrdZrD/owmSsPBekphiLAau7WC\nx7NFVRrdTuWRZrN0T+UkkPciGfKujIO3GlZ2iTs6+Pox97/zzL/MNdSjoEo/EYjo\n0mBG2s+JwXBjNo6zLOnrbdcnIBfGIqanDulkGGFtsFYc89/awXTU7v5rF4iyvTN/\nNoZ0WqetEBAYyVF1eJejI7TWqSwYvjHuTcMWQXIZWQKBgQDodM5pOl5K3G7OUhTJ\nzc9LUO4tupLNwU4mTpDOKbAFdumFcBtHT+P5JS0uqtOpr7enxFmRgQcQcU4Wk4sx\nOIrlBAqq9tZvdVA+ecfzWjcqf11LUikxD/ZuDfIHOiM7GcGTWNCcktItck7r1BM0\n7SQ8oz9qm1Lrv8SmQOSmMVgWewKBgQDnaLLIZcOM1qcPlXkV22WqHMYwIqTUYVN8\npSSDIZ/TIAbM/4tNy0EnjnJXPC4ymMBfVqiQy9CMBZbTNB8YgbMCzwmM0c+6ouKq\n/Jj/mtaYBKUqnFQEDX7VmoT/RUjSmjX+BZbpwmuNtTTobGq2VUQXSEIG9eHY1xrG\nEmWiUb+23wKBgAK95fVdx+DwKqpqU25x7AECalzFt5ePsSFIifK0kSvvVB/Ly7aS\nnajBpH/Jage1V+A1s6zArdmmzHn9sYWaGiFLY+jSUoMsCg9ClnYrWT06FVqfFHdM\nreZsaa9mIyY+ToczY/qEzM/WalHjxXo5VdUVQ9k5DchUEbi4STogmN5jAoGBAN0c\n2H/NZP3E+RpV674rxke2eNTztWXNnXVjYrD9xvZ4CqeEofnydc4zOSQLt+TWujIe\n3rCEXz/78zLaAcBr5b2QUILC0+d0znstI5BQxi25eoxtlYXN01yM6fn0nPHHMkIH\n2zx/bj+YXvaa6ZhRft90RsrZ1TRZzRZn678et74nAoGAASD3oRV/9olTOyLjZ+Pk\n8f4ap9Sa3/51LXQup4gWiZZUcSUjRu3qDqI5j3eFVP15v1DDNRGJMf01ej3XVHj3\narAIty7wrIZ/a2EK7PSpMCcTNgvNlkVxgMPHhFGpLLLxzysGfmWSVY2ZYSUBGUMm\n+HzcVqTUG+Oa55/2SjwIbrY=\n-----END PRIVATE KEY-----\n",
        }),
    })
}
const adminAuth = admin.auth(firebaseAdmin)

// This is used to sync Firestore Admin Authentication with NextAuth using the FirestoreAdapter
const firestoreAdmin = initFirestore({
    credential: admin.credential.cert({
        projectId: "agm-datalake",
        clientEmail: "firebase-adminsdk-viaos@agm-datalake.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDSIHgL/Zje8gOo\nC5smn77diKLFFQ54fs9cctfLPwnxSE/8PmO58sGog65+1pz35YQx4Mwu9+ZtT03P\nWW+oPpcAmT4+BYNH1GojxzotiabDLzTouMoecr4CWFhnovyLU52JSCC8QpFhx1eP\nR8FhR6BjuWUpzG5xcyhjnxLG000Gu/1YI6G1t5QSaYYHLuw2JTFRfjOfGEF11N9W\nUKbtvLcL/YDa1KjzRKOLa+GZdkyFK7KNTUAG9Zxa57yPcgvzTf866bxtmtwE7MO1\nMB6i+3Nh6EnLJabqJ6AEx/ttlhdnBUeN83cwNIsqV+Xhpv1uTG8XKtFhn7/e99Pz\nxIVMfAclAgMBAAECggEAUsC6xm4fUF4blojLl5B+CJ0RDXDXfBjk7VHFLqQq9D04\nUuz3NXonTohdplI7C132i/YuM6kptI7w4+IjGS1dJr0zSBW/uAAttN13SgvWAzSK\nL8TmxMsHjcDhQB9uOii5+CDR05Kb0thA4Yqu2/LrdZrD/owmSsPBekphiLAau7WC\nx7NFVRrdTuWRZrN0T+UkkPciGfKujIO3GlZ2iTs6+Pox97/zzL/MNdSjoEo/EYjo\n0mBG2s+JwXBjNo6zLOnrbdcnIBfGIqanDulkGGFtsFYc89/awXTU7v5rF4iyvTN/\nNoZ0WqetEBAYyVF1eJejI7TWqSwYvjHuTcMWQXIZWQKBgQDodM5pOl5K3G7OUhTJ\nzc9LUO4tupLNwU4mTpDOKbAFdumFcBtHT+P5JS0uqtOpr7enxFmRgQcQcU4Wk4sx\nOIrlBAqq9tZvdVA+ecfzWjcqf11LUikxD/ZuDfIHOiM7GcGTWNCcktItck7r1BM0\n7SQ8oz9qm1Lrv8SmQOSmMVgWewKBgQDnaLLIZcOM1qcPlXkV22WqHMYwIqTUYVN8\npSSDIZ/TIAbM/4tNy0EnjnJXPC4ymMBfVqiQy9CMBZbTNB8YgbMCzwmM0c+6ouKq\n/Jj/mtaYBKUqnFQEDX7VmoT/RUjSmjX+BZbpwmuNtTTobGq2VUQXSEIG9eHY1xrG\nEmWiUb+23wKBgAK95fVdx+DwKqpqU25x7AECalzFt5ePsSFIifK0kSvvVB/Ly7aS\nnajBpH/Jage1V+A1s6zArdmmzHn9sYWaGiFLY+jSUoMsCg9ClnYrWT06FVqfFHdM\nreZsaa9mIyY+ToczY/qEzM/WalHjxXo5VdUVQ9k5DchUEbi4STogmN5jAoGBAN0c\n2H/NZP3E+RpV674rxke2eNTztWXNnXVjYrD9xvZ4CqeEofnydc4zOSQLt+TWujIe\n3rCEXz/78zLaAcBr5b2QUILC0+d0znstI5BQxi25eoxtlYXN01yM6fn0nPHHMkIH\n2zx/bj+YXvaa6ZhRft90RsrZ1TRZzRZn678et74nAoGAASD3oRV/9olTOyLjZ+Pk\n8f4ap9Sa3/51LXQup4gWiZZUcSUjRu3qDqI5j3eFVP15v1DDNRGJMf01ej3XVHj3\narAIty7wrIZ/a2EK7PSpMCcTNgvNlkVxgMPHhFGpLLLxzysGfmWSVY2ZYSUBGUMm\n+HzcVqTUG+Oa55/2SjwIbrY=\n-----END PRIVATE KEY-----\n",
    }),
})

export { firestoreAdmin, adminAuth }