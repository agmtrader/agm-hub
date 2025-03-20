'use server'

import { Map } from "../lib/types"
import { getServerSession, User } from 'next-auth'
import { authOptions } from "./auth";

interface AuthenticationResponse {
    access_token: string,
    expires_in: number
}

// Add token caching
let cachedToken: string | null = null;
let tokenExpirationTime: number | null = null;
const api_url = process.env.DEV_MODE === 'true' ? 'http://127.0.0.1:5000' : 'https://api.agmtechnology.com';

export async function accessAPI(url: string, type: string, params?: Map) {

    const token = await getToken();
    if (!token) throw new Error('Failed to get authentication token');
    if (type === 'GET') {
        return await GetData(url, token);
    } else {
        return await PostData(url, params, token);
    }
}

async function getToken(): Promise<string | null> {
    
    const session = await getServerSession(authOptions);
    if (!session || !session?.user) throw new Error('No session found');

    if (cachedToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
        //console.log('Using cached token')
        //return cachedToken;
    }

    try {
        const response = await fetch(`${api_url}/token`, {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({token: session?.user?.id, scopes: session?.user?.scopes}),
        })

        if (!response.ok) return null;

        const auth_response: AuthenticationResponse = await response.json();

        // Cache the token using server-provided expiration time
        //cachedToken = auth_response.access_token
        //tokenExpirationTime = Date.now() + (auth_response.expires_in * 1000) // Convert seconds to milliseconds
        return auth_response.access_token

    } catch (error) {
        return null;
    }
}

async function GetData(url: string, token: string) {
    try {
        const response = await fetch(`${api_url}${url}`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return await response.json();
        } else {
            return await response.blob();
        }

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch data: ${error.message}`);
        }
        throw new Error('Failed to fetch data');
    }
}

async function PostData(url: string, params: Map | undefined, token: string) {
    try {
        const response = await fetch(`${api_url}${url}`, {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to post data: ${error.message}`);
        }
        throw new Error('Failed to post data');
    }
}

export async function LoginUserWithCredentials(username:string, password:string) {
    try {
        const response = await fetch(`${api_url}/oauth/login`, {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({'username': username, 'password': password}),
        });
  
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }
  
        const user = await response.json()
        return user
  
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to post data: ${error.message}`);
        }
        throw new Error('Failed to post data');
    }
}

export async function CreateUser(userData:User) {
    try {
        const response = await fetch(`${api_url}/oauth/create`, {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({'data': userData, 'id': userData.id}),
        });
  
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }
  
        const user = await response.json()
        return user
  
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to post data: ${error.message}`);
        }
        throw new Error('Failed to post data');
    }
}