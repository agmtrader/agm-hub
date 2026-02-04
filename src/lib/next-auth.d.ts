import NextAuth, { DefaultUser, DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt";
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User extends DefaultUser {
    created: string
    updated: string
    last_login: string
    scopes: string;
    contact_id: string;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: User["id"]
    email: User["email"]
    scopes: User["scopes"]
  }
}