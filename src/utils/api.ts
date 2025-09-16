'use server'

import { Map } from "../lib/public/types"
import { getServerSession } from 'next-auth'
import { authOptions } from "./auth";

interface AuthenticationResponse {
    access_token: string,
    expires_in: number
}

// Add token caching
const api_url = process.env.DEV_MODE === 'true' ? 'http://127.0.0.1:5000' : 'https://api.agmtechnology.com';

export async function accessAPI(url: string, type: string, params?: Map) {

    const token = await getToken();
    if (type === 'GET') {
        return await GetData(url, token);
    } else {
        return await PostData(url, params, token);
    }

}

export async function getToken(): Promise<string> {

    const response = await fetch(`${api_url}/token`, {
        method: 'POST',
        headers: {
            'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({token: 'all'}),
    })

    if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 404 || response.status === 500) throw new Error(`Failed to get authentication token.`);

    const auth_response: AuthenticationResponse = await response.json();
    if (!auth_response.access_token) throw new Error(`Failed to get authentication token.`);
    return auth_response.access_token
}

async function GetData(url: string, token: string) {
    const response = await fetch(`${api_url}${url}`, {
        headers: {
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${token}`
        },
    });

    if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 404 || response.status === 500) throw new Error(`An unknown error occurred. Please try again later.`);
    return await response.json();
}

async function PostData(url: string, params: Map | undefined, token: string) {
    const response = await fetch(`${api_url}${url}`, {
        method: 'POST',
        headers: {
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(params),
    });

    if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 404 || response.status === 500) throw new Error(`An unknown error occurred. Please try again later.`);
    return await response.json();
}
