import { User } from "next-auth"

export type UserPayload = Omit<User, 'id' | 'created' | 'updated' > & {
    password: string
}