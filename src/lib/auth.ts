import { adminAuth, firestoreAdmin } from "@/utils/firebase-admin"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { NextAuthOptions } from "next-auth"

import GoogleProvider from 'next-auth/providers/google'

import CredentialsProvider from "next-auth/providers/credentials"


// Borrar drive y poner solo profile?!
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
            scope: "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
          }
        }
      }),
      CredentialsProvider({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'Credentials',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          // You need to provide your own logic here that takes the credentials
          // submitted and returns either a object representing a user or value
          // that is false/null if the credentials are invalid.
          // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
          // You can also use the `req` object to obtain additional parameters
          // (i.e., the request IP address)
          // Return null if user data could not be retrieved
          return null
        }
      })
    ],
    adapter: FirestoreAdapter(firestoreAdmin),
    callbacks: {

      jwt: async ({ token, user, account }) => {

        // Get user's
        if (user) {
          token.sub = user.id
          token.email = user.email
          token.name = user.name
          token.picture = user.image
        }
        
        // Get user's credentials
        if (account) {
          token.accessToken = account.access_token
          token.refreshToken = account.refresh_token
        }
        
        return token
      },

      async session({ session, token }) {

        if (session?.user) {
          
          if (token.sub) {

            // Authenticate Google Drive
            session.user.id = token.sub

            // Build profile
            if (token.picture) {
              session.user.image = token.picture
            }
            if (token.name) {
              session.user.name = token.name
            }
            if (token.email) {
              session.user.email = token.email
            }
            if (token.accessToken) {
              session.user.accessToken = token.accessToken
            }
            if (token.refreshToken) {
              session.user.refreshToken = token.refreshToken
            }

            // Authenticate Firebase
            const options = {
              admin: false,
            }
        
            if (session.user.email?.split('@')[1] == 'agmtechnology.com') {
              options.admin = true
              session.user.admin = true
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