import { authedUsers } from "@/lib/authed-users"
import { adminAuth, firestoreAdmin } from "@/utils/firebase-admin"
import { auth } from "@/utils/firestore"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from 'next-auth/providers/google'

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
  adapter: FirestoreAdapter(firestoreAdmin),
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    async session({ session, token, user }) {
      if (session?.user) {
        if (token.sub) {
          session.user.id = token.sub

          /*
          const options = {
            admin: false
          }

          if (session.user.email?.split('@')[1] == 'agmtechnology.com' || authedUsers.includes(session.user.email)) {
            options.admin = true
          }
          */

          const firebaseToken = await adminAuth.createCustomToken(token.sub)
          session.firebaseToken = firebaseToken
          
        }
      }
      return session
    },
  },
  session: {
    strategy: 'jwt'
  },
})

export { handler as GET, handler as POST }