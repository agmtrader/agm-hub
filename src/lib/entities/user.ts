import { User } from "next-auth"

export type UserPayload = Omit<User, 'id'> & {
    password: string
}