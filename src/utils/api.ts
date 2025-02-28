import { Map } from "../lib/types"
import { tryCatch } from "./try-catch"

interface AuthenticationResponse {
    access_token: string
}

export async function accessAPI(url:string, type:string, params?:Map) {

    async function getToken():Promise<string | null> {

        const fetch_promise = fetch(`${api_url}/login`, {
            method: 'POST',
            headers:{
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({username: "admin", password: "password"}),
        })

        const {data, error} = await tryCatch(fetch_promise)

        if (!data && error) {
            return null
        }
        
        if (data && !error) {
            const auth_response:AuthenticationResponse = await data.json()
            return auth_response.access_token
        }

        return null

    }

    async function getData(token:string):Promise<any> {
        const response = await fetch(`${api_url}${url}`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': 'Bearer ' + token
            },
        })
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            return await response.json()
        }
        return await response.blob()
    }

    async function postData(token:string):Promise<any> {
        const fetch_promise = fetch(`${api_url}${url}`, {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(params),
        })

        const {data, error} = await tryCatch(fetch_promise)

        if (!data && error) {
            return null
        }

        if (data && !error) {
            const data_response = await data.json()
            console.log('API Response', data_response)
            return data_response
        }

        return null
    }

    let data = null
    const api_url = process.env.AGM_API_URL
    const token = await getToken()

    if (!token) throw new Error('Failed to get token')
    if (type === 'GET') {
        data = await getData(token)
    } else {
        data = await postData(token)
    }

    return data
}