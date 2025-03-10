import { accessAPI } from "@/utils/api";
import { User } from "next-auth";

export async function CreateUser(user: User) {
    console.log(user)
    await accessAPI('/database/create', 'POST', {
        path: 'users',
        data: user,
        id: user.id
    })
}

export async function ReadUserByEmail(email: string) {
    const users = await accessAPI('/database/read', 'POST', {
        path: 'users',
        query: { email }
    })
    if (users.length === 0) return null
    if (users.length > 1) throw new Error('Multiple users found')
    return users[0]
}

export async function ReadUserByUsername(username: string) {
    const users = await accessAPI('/database/read', 'POST', {
        path: 'users',
        query: { username }
    })
    if (users.length === 0) return null
    if (users.length > 1) throw new Error('Multiple users found')
    return users[0]
}
