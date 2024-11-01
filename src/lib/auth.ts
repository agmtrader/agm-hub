import { adminAuth, firestoreAdmin } from "@/utils/firebase-admin"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials"
import { accessAPI } from "@/utils/api"

export const authOptions: NextAuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
        name: 'Credentials',
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (credentials?.username && credentials?.password) {
            try {
              const response = await accessAPI('/database/read', 'POST', {
                path: 'users',
                query: {
                  'username': credentials.username
                }
              })
              return response['content'][0]
            } catch (error) {
              console.error('Authentication error:', error);
              return null;
            }
          }
          return null
        }
      }),
    ],
    adapter: FirestoreAdapter(firestoreAdmin),
    callbacks: {

      jwt: async ({ token, user, account }) => {
        if (user) {
          token.sub = user.id
          token.email = user.email
          token.name = user.name
          token.picture = user.image

          if (account?.provider === 'google') {
            token.accessToken = account.access_token
            token.refreshToken = account.refresh_token
          }
          console.log(token)
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
    pages: {
      signIn: '/signin',
    },
    session: {
      strategy: 'jwt'
    },
}