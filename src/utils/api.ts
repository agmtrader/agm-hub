import { Map } from "../lib/types"

export async function accessAPI(url:string, type:string, params?:Map) {

    async function getToken() {
        const data = await fetch(`${api_url}/login`, {
        method: 'POST',
        headers:{
            'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({username: "admin", password: "password"}),
        }).then(response => response.json()).then(async (data) => await data)
        try {
            return data['access_token']
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async function getData(token:string) {
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

    async function postData(token:string) {
        const response = await fetch(`${api_url}${url}`, {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(params),
        })
        
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            return await response.json()
        }
        return await response.blob()
    }

    let data = null
    const api_url = process.env.AGM_API_URL
    const token = await getToken()

    if (type === 'GET') {
        data = await getData(token)
    } else {
        data = await postData(token)
    }

    return data
}