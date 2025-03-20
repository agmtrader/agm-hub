import NextAuth, { DefaultUser, DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt";
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User extends DefaultUser {
    emailVerified: boolean
    username: string | null
    country: string | null
    accessToken?: string;
    refreshToken?: string;
    scopes: string;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    firebaseToken: string;
    user: User & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: User["id"]
    name: User["name"]
    email: User["email"]
    image: User["image"]
    emailVerified: User["emailVerified"]
    username: User["username"]
    country: User["country"]
    role: User["role"]
    accessToken: User["accessToken"]
    refreshToken: User["refreshToken"]
    scopes: User["scopes"]
  }
}