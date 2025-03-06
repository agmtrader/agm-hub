import { accessAPI } from "../api"

export async function UpdateUser(data: any, query: any) {
    const user = await accessAPI('/database/update', 'POST', {
        'path': 'users',
        'data': data,
        'query': query
    })
    return user
}

export async function GetUserPassword(query: any) {
    const users = await accessAPI('/database/read', 'POST', {
        'path': 'users',
        'query': query
    })
    if (users.length === 0) {
        return null
    } else if (users.length > 1) {
        throw new Error('Multiple users found')
    }
    
    return users[0].password
}