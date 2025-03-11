'use server'

import { Map } from "../lib/types"
import { getSecret } from "./secret-manager";

interface AuthenticationResponse {
    access_token: string
}

// Add token caching
let cachedToken: string | null = null;
let tokenExpirationTime: number | null = null;
const api_url = process.env.DEV_MODE === 'true' ? 'http://127.0.0.1:5000' : 'https://api.agmtechnology.com';

async function getToken(): Promise<string | null> {

    if (cachedToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
        return cachedToken;
    }

    // Fetch authentication token from secret manager
    const authToken = await getSecret('AGM_AUTHENTICATION_TOKEN');

    const response = await fetch(`${api_url}/login`, {
        method: 'POST',
        headers: {
            'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({token: authToken}),
    });

    if (!response.ok) return null

    const auth_response: AuthenticationResponse = await response.json();

    // Cache the token and set expiration time (1 hour)
    cachedToken = auth_response.access_token;
    tokenExpirationTime = Date.now() + 3600000; // 1 hour in milliseconds
    return auth_response.access_token;
}

export async function accessAPI(url: string, type: string, params?: Map) {

    const token = await getToken();
    if (!token) throw new Error('Failed to get authentication token');

    try {
        if (type === 'GET') {
            return await GetData(url, token);
        } else {
            return await PostData(url, params, token);
        }
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

async function GetData(url: string, token: string) {
    const response = await fetch(`${api_url}${url}`, {
        headers: {
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) throw new Error('API request failed');

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
        return await response.json();
    }
    return await response.blob();
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

    if (!response.ok) throw new Error('API request failed');

    return await response.json();
}