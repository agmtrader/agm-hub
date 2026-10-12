'use server'

import { ApiRequestError, ApiResult } from "./api-result"
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
        const email = process.env.AGM_API_HUB_EMAIL;
        const password = process.env.AGM_API_HUB_PASSWORD;
        if (!email || !password) throw new ApiRequestError('Hub API credentials are not configured.')

        let response: Response
        try {
            response = await fetch(`${api_url}/token`, {
                method: 'POST',
                headers: { 'Cache-Control': 'no-cache', 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
        } catch {
            throw new ApiRequestError('The AGM API is unavailable. Please try again shortly.')
        }
        const payload = await response.json().catch(() => ({}))
        if (!response.ok) {
            throw new ApiRequestError(
                typeof payload?.message === 'string' ? payload.message : 'Hub authentication failed.',
            )
        }
        const auth_response: AuthenticationResponse = payload;
        if (!auth_response.access_token) throw new ApiRequestError(`Failed to get authentication token.`);

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
    return request(url, 'GET', undefined, token)
}

async function PostData(url: string, params: Map | undefined, token: string) {
    return request(url, 'POST', params, token)
}

async function DeleteData(url: string, params: Map | undefined, token: string) {
    return request(url, 'DELETE', params, token)
}

async function PatchData(url: string, params: Map | undefined, token: string) {
    return request(url, 'PATCH', params, token)
}

async function request(url: string, method: string, params: Map | undefined, token: string) {
    let response: Response
    try {
        response = await fetch(`${api_url}${url}`, {
            method,
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${token}`,
                ...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
            },
            ...(method !== 'GET' ? { body: JSON.stringify(params) } : {}),
        })
    } catch {
        throw new ApiRequestError('The AGM API is unavailable. Please try again shortly.')
    }

    const requestId = response.headers.get('X-Request-ID') || undefined
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
        const message = typeof payload?.message === 'string' ? payload.message :
            typeof payload?.error === 'string' ? payload.error :
            response.status === 403 ? 'This operation is not enabled for the Hub.' :
            response.status === 401 ? 'Hub authentication expired or was rejected.' :
            'The request could not be completed.'
        throw new ApiRequestError(`${message}${requestId ? ` (request ID: ${requestId})` : ''}`, response.status, typeof payload?.code === 'string' ? payload.code : undefined, requestId)
    }
    return payload
}

// Expected transport failures cross the action boundary as data, preserving UI guidance.
export async function accessAPIResult(url: string, type: string, params?: Map): Promise<ApiResult> {
    try {
        return { ok: true, data: await accessAPI(url, type, params) }
    } catch (error) {
        if (!(error instanceof ApiRequestError)) throw error
        return { ok: false, error: {
            message: error.message,
            ...(error.status !== undefined ? { status: error.status } : {}),
            ...(error.code !== undefined ? { code: error.code } : {}),
            ...(error.requestId !== undefined ? { requestId: error.requestId } : {}),
        } }
    }
}
