import { authedUsers } from "@/lib/authed-users"
import { adminAuth, firestoreAdmin } from "@/utils/firebase-admin"
import { auth } from "@/utils/firestore"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import NextAuth, { NextAuthOptions } from "next-auth"

import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
        checks: 'none',
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            scope: "openid https://www.googleapis.com/auth/drive"
          }
        }
      }),
    ],
    adapter: FirestoreAdapter(firestoreAdmin),
    callbacks: {
      jwt: async ({ token, user, account }) => {

        if (user) {
          token.sub = user.id
          
        }
        
        if (account) {
          token.accessToken = account.access_token
          token.refreshToken = account.refresh_token
        }
        
        return token
      },
      async session({ session, token }) {
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

          if (token.accessToken && token.refreshToken) {

            session.user.accessToken = token.accessToken
            session.user.refreshToken = token.refreshToken

          }
          
        }
        return session
      },
    },
    session: {
      strategy: 'jwt'
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }