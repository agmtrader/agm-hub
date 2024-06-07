import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'

import * as admin from 'firebase-admin'

import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { db, firebase } from "@/utils/firestore"
import { GoogleAuthProvider, getAuth, signInWithCredential } from "firebase/auth"

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
      return token
    },
    async session({ session, token, user }) {
      return session
    },
  },
  session: {
    strategy: 'jwt'
  }
})

export { handler as GET, handler as POST }