import { adminAuth, firestoreAdmin } from "@/utils/firebase-admin"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { NextAuthOptions, User } from "next-auth"
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

              // Fetch user profile from same database where Google Auth is stored
              const response = await accessAPI('/database/read', 'POST', {
                path: 'users',
                query: {
                  'username': credentials.username,
                  'password': credentials.password
                }
              })

              const user:User = response['content'][0]
              return user

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

      async jwt({ token, user, account }) {

        // Build token from user profile
        // This can be Google Response or Credentials Response
        // Both use the same database
        
        if (user) {

          token.sub = user.id
          token.email = user.email || null
          token.name = user.name || null
          token.image = user.image || null

          token.role = user.role || 'user'
          token.emailVerified = user.emailVerified || false
          token.country = user.country || null
          token.username = user.username || null

          if (account?.provider === 'google') {
            token.accessToken = account.access_token || null
            token.refreshToken = account.refresh_token || null
          }

        }
        
        return token
      },
      async session({ session, token }) {

        if (session?.user) {
          
          if (token.sub) {

            // Build NextAuth user profile from token
            session.user.id = token.sub
            session.user.name = token.name || null
            session.user.email = token.email || null
            session.user.image = token.image || null

            session.user.emailVerified = token.emailVerified || false
            session.user.username = token.username || null
            session.user.country = token.country || null
            session.user.role = token.role || 'user'

            if (token.accessToken) {
              session.user.accessToken = token.accessToken
            }
            if (token.refreshToken) {
              session.user.refreshToken = token.refreshToken
            }
        
            if (session.user.email?.split('@')[1] == 'agmtechnology.com') {
              session.user.role = 'admin'
            }

            // Sync Firebase Authentication profile with login information
            let currentUser = null
            try {
              currentUser = await adminAuth.getUser(token.sub)
            } catch (error) {
              currentUser = await adminAuth.createUser({
                uid: token.sub,
              })
            }

            if (!currentUser) {
              throw new Error('Failed to create or fetch user in Firebase Authentication')
            }

            if (!currentUser.email && session.user.email) {
              await adminAuth.updateUser(token.sub, { email: session.user.email })
            }

            if (!currentUser.displayName && session.user.name) {
              await adminAuth.updateUser(token.sub, { displayName: session.user.name })
            }

            if (!currentUser.photoURL && session.user.image) {
              await adminAuth.updateUser(token.sub, { photoURL: session.user.image })
            }
          
            // Create Firebase Authentication token for all users
            // This is used to authenticate all users for forms
            // Options grant admin access to the dashboard and other admin features

            const firebaseToken = await adminAuth.createCustomToken(token.sub, { role: session.user.role })
            session.firebaseToken = firebaseToken

          }
          
        }
        return session
      },
      async signIn({ }) {
        return true
      }

    },
    pages: {
      signIn: '/signin',
    },
    session: {
      strategy: 'jwt'
    },
}