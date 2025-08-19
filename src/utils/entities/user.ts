import { accessAPI } from "../api"
import { User } from "next-auth"
import { IDResponse } from "@/lib/entities/base"
import { UserPayload } from "@/lib/entities/user"

const api_url = process.env.DEV_MODE === 'true' ? 'http://127.0.0.1:5000' : 'https://api.agmtechnology.com';

export async function CreateUser(userData:UserPayload) {
    try {
        const response = await fetch(`${api_url}/users/create`, {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({'user': userData}),
        });
  
        if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  
        const user = await response.json()
        return user
  
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
}

export async function LoginUserWithCredentials(email:string, password:string) {
    try {
        const response = await fetch(`${api_url}/users/login`, {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({'email': email, 'password': password}),
        });
  
        if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  
        const user = await response.json()
        return user
  
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
}

export async function ReadUsers() {
    let users:User[] = await accessAPI('/users/read', 'GET')
    return users.sort((a, b) => (b.id.toString().localeCompare(a.id.toString())))   
}

export async function ReadUserByID(id:string) {
    let users:User[] = await accessAPI(`/users/read?id=${id}`, 'GET')
    if (users.length > 1) throw new Error('Multiple users found with same ID')
    if (users.length === 0) return null
    return users[0]
}

export async function ReadUserByEmail(email: string) {
    const users = await accessAPI(`/users/read?email=${email}`, 'GET')
    if (users.length === 0) return null
    if (users.length > 1) throw new Error('Multiple users found')
    return users[0]
}

export async function ReadUserByUsername(username: string) {
    const users = await accessAPI(`/users/read?username=${username}`, 'GET')
    if (users.length === 0) return null
    if (users.length > 1) throw new Error('Multiple users found')
    return users[0]
}

export async function ReadUserPassword(id:string) {
    const users = await accessAPI(`/users/read?id=${id}`, 'GET')
    if (users.length === 0) return null
    if (users.length > 1) throw new Error('Multiple users found')
    return users[0].password
}

export async function UpdateUserByID(id:string, data:Partial<User>) {
    const updateResponse: IDResponse = await accessAPI('/users/update', 'POST', {'data': data, 'query': {'id': id}})
    return updateResponse
}

export async function UpdateUserByEmail(email:string, data:Partial<User>) {
    const updateResponse: IDResponse = await accessAPI('/users/update', 'POST', {'data': data, 'query': {'email': email}})
    return updateResponse
}