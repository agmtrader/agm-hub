import { adminAuth, firestoreAdmin } from "@/utils/firebase-admin"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { NextAuthOptions } from "next-auth"

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

      async signIn({ user }) {
        return true;
      },

      jwt: async ({ token, user, account }) => {

        if (user) {
          console.log(user)
          token.sub = user.id
        }
        
        if (account) {
          console.log(account)
          token.email = user.email
          token.accessToken = account.access_token
          token.refreshToken = account.refresh_token
        }
        
        return token
      },
      async session({ session, token }) {

        if (session?.user) {

          if (token.sub) {

            session.user.id = token.sub
  
            const options = {
              admin: false
            }
            
            if (token.accessToken && token.refreshToken) {
              options.admin = true
              session.user.accessToken = token.accessToken
              session.user.refreshToken = token.refreshToken
            }

            const firebaseToken = await adminAuth.createCustomToken(token.sub, options)
            session.firebaseToken = firebaseToken

          }
          
        }
        return session
      },
    },
    session: {
      strategy: 'jwt'
    },
}