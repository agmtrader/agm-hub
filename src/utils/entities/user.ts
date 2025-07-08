import { accessAPI } from "../api"
import { User } from "next-auth"
import { IDResponse } from "@/lib/entities/base"

export async function CreateUser(user:User): Promise<IDResponse> {
    const user_response: IDResponse = await accessAPI('/users/create', 'POST', {'user': user})
    return user_response
}

export async function ReadUsers() {
    let users:User[] = await accessAPI('/users/read', 'POST', {})
    return users.sort((a, b) => (b.id.toString().localeCompare(a.id.toString())))   
}

export async function ReadUserByID(id:string) {
    let users:User[] = await accessAPI('/users/read', 'POST', {'query': {'id': id}})
    if (users.length > 1) throw new Error('Multiple users found with same ID')
    if (users.length === 0) return null
    return users[0]
}

export async function ReadUserByEmail(email: string) {
    const users = await accessAPI('/users/read', 'POST', {'query': {'email': email}})
    if (users.length === 0) return null
    if (users.length > 1) throw new Error('Multiple users found')
    return users[0]
}

export async function ReadUserByUsername(username: string) {
    const users = await accessAPI('/users/read', 'POST', {'query': {'username': username}})
    if (users.length === 0) return null
    if (users.length > 1) throw new Error('Multiple users found')
    return users[0]
}

export async function ReadUserPassword(id:string) {
    const users = await accessAPI('/users/read', 'POST', {'query': {'id': id}})
    if (users.length === 0) return null
    if (users.length > 1) throw new Error('Multiple users found')
    return users[0].password
}

export async function UpdateUserByID(id:string, data:any) {
    const updateResponse: IDResponse = await accessAPI('/users/update', 'POST', {'data': data, 'query': {'id': id}})
    return updateResponse
}

export async function UpdateUserByEmail(email:string, data:any) {
    const updateResponse: IDResponse = await accessAPI('/users/update', 'POST', {'data': data, 'query': {'email': email}})
    return updateResponse
}