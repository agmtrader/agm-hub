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
            console.log(error)
            return null
        }
    }

    async function getData(token:string) {
        const data = await fetch(`${api_url}${url}`, {
        headers:{
            'Cache-Control': 'no-cache',
            'Authorization': 'Bearer ' + token
        },
        }).then(response => response.json()).then(async (data) => await data)
        return data
    }

    async function postData(token:string) {
        const data = await fetch(`${api_url}${url}`, {
        method: 'POST',
        headers:{
            'Cache-Control': 'no-cache',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(params),
        }).then(response => response.json()).then(async (data) => await data)
        return data
    }

    let data = null
    const api_url = "https://agm-api-m11y.onrender.com"
    const token = await getToken()

    if (type === 'GET') {
        data = await getData(token)
    } else {
        data = await postData(token)
    }

    return data
}