import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'

import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  })
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      token.uid = account?.userId
      return token
    },
    async session({ session, token, user }) {
      
      if (token && token.uid) {
        const firebaseToken = await admin.auth().createCustomToken(token.uid as string)
        session.firebaseToken = firebaseToken
      }
      return session
    }
  },
  session: {
    strategy: 'jwt'
  }
})

export { handler as GET, handler as POST }

