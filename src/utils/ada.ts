'use server'

import { Map } from "../lib/types"
import { getToken } from "./api";

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatResponse {
    model: string;
    message: ChatMessage;
}

const api_url = process.env.DEV_MODE === 'true' ? 'http://127.0.0.1:3333' : 'https://ada-api-571127175324.us-central1.run.app/';

export async function accessAda(url: string, params?: Map) {

    const token = await getToken();
    if (!token) throw new Error('Failed to get authentication token');
    return await PostData(url, params, token);

}

async function PostData(url: string, params: Map | undefined, token: string) {
    try {
        const response = await fetch(`${api_url}${url}`, {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
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

export async function chat(messages: ChatMessage[]): Promise<ChatResponse> {
    return await accessAda('/ada/chat', { messages });
}