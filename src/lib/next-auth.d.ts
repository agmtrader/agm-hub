import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    firebaseToken: string;
    accessToken: string;
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?:string
    uid?: string
  }
}