'use server'

import { Map } from "../lib/types"
import { getServerSession, User } from 'next-auth'
import { authOptions } from "./auth";
import { UserPayload } from "@/lib/entities/user";

interface AuthenticationResponse {
    access_token: string,
    expires_in: number
}

// Add token caching
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

export async function getToken(): Promise<string | null> {
    
    const session = await getServerSession(authOptions);
    if (!session || !session?.user) throw new Error('No session found');

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

        if (response.status === 400) throw new Error('Bad Request');
        if (response.status === 401) throw new Error('Unauthorized');
        if (response.status === 403) throw new Error('You do not have permission to access this resource');
        if (response.status === 404) throw new Error('Resource not found');
        if (response.status === 500) throw new Error('Internal Server Error');
        if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`);

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return await response.json();
        } else {
            return await response.blob();
        }

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
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

        if (response.status === 400) throw new Error('Bad Request');
        if (response.status === 401) throw new Error('Unauthorized');
        if (response.status === 403) throw new Error('You do not have permission to access this resource');
        if (response.status === 404) throw new Error('Resource not found');
        if (response.status === 500) throw new Error('Internal Server Error');
        if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`);

        return await response.json();

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
}

export async function LoginUserWithCredentials(email:string, password:string) {
    try {
        const response = await fetch(`${api_url}/oauth/login`, {
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

export async function CreateUser(userData:UserPayload) {
    try {
        const response = await fetch(`${api_url}/oauth/create`, {
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