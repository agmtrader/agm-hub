import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    firebaseToken: string;
    user: {
      address: string
    } & DefaultSession["user"]
  }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string
  }
}