'use server'

import { Map } from "../lib/public/types"

interface AuthenticationResponse {
    access_token: string,
    expires_in: number
}

const api_url = process.env.DEV_MODE === 'true' ? 'http://127.0.0.1:5000' : 'https://api.agmtechnology.com';
const TOKEN_EXPIRY_BUFFER_SECONDS = 30;
let cachedToken: string | null = null;
let cachedTokenExpiryMs = 0;
let inFlightTokenRequest: Promise<string> | null = null;

export async function accessAPI(url: string, type: string, params?: Map) {

    const token = await getToken();
    if (type === 'GET') {
        return await GetData(url, token);
    } else if (type === 'POST') {
        return await PostData(url, params, token);
    } else if (type === 'DELETE') {
        return await DeleteData(url, params, token);
    } else if (type === 'PATCH') {
        return await PatchData(url, params, token);
    }

}

export async function getToken(): Promise<string> {
    const now = Date.now()
    if (cachedToken && now < cachedTokenExpiryMs) return cachedToken
    if (inFlightTokenRequest) return inFlightTokenRequest

    inFlightTokenRequest = (async () => {
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

        const tokenLifetimeSeconds = Math.max(0, Number(auth_response.expires_in || 0) - TOKEN_EXPIRY_BUFFER_SECONDS)
        cachedToken = auth_response.access_token
        cachedTokenExpiryMs = Date.now() + tokenLifetimeSeconds * 1000
        return auth_response.access_token
    })()

    try {
        return await inFlightTokenRequest
    } finally {
        inFlightTokenRequest = null
    }
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

async function DeleteData(url: string, params: Map | undefined, token: string) {
    const response = await fetch(`${api_url}${url}`, {
        method: 'DELETE',
        headers: {
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(params),
    });
    if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 404 || response.status === 500) throw new Error(`An unknown error occurred. Please try again later.`);
    return await response.json();
}

async function PatchData(url: string, params: Map | undefined, token: string) {
    const response = await fetch(`${api_url}${url}`, {
        method: 'PATCH',
        headers: {
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(params),
    });
    if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 404 || response.status === 500) throw new Error(`An unknown error occurred. Please try again later.`);
    return await response.json();
}
