import NextAuth, { DefaultUser, DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt";
import { JWT } from "next-auth/jwt"

export interface CreateUserPayload {
  name: string
  email: string
  image: string
  password: string
  scopes: string
}

declare module "next-auth" {
  interface User extends DefaultUser {
    created: string
    updated: string
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
    accessToken: User["accessToken"]
    refreshToken: User["refreshToken"]
    scopes: User["scopes"]
  }
}