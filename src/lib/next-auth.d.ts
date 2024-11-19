import NextAuth, { DefaultUser, DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    firebaseToken: string;
    user: User & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?:string
    refreshToken?: string
    uid?: string
  }
}

declare module "next-auth" {
  interface User extends DefaultUser {
    accessToken: string;
    refreshToken: string;
    emailVerified: boolean
    admin: boolean
    username: string | undefined
    password: string | undefined
    country: string | undefined
  }
}