import { Map } from "../lib/types"

export async function accessAPI(url:string, type:string, params?:Map) {

    async function getData() {
        const data = await fetch("http://10.4.178.122:5001" + url, {
        headers:{'Cache-Control': 'no-cache'}
        }).then(response => response.json()).then(async (data) => await data)
        return data
    }

    async function postData() {
        const data = await fetch("http://10.4.178.122:5001" + url, {
        method: 'POST',
        headers:{'Cache-Control': 'no-cache'},
        body: JSON.stringify(params),
        }).then(response => response.json()).then(async (data) => await data)
        return data
    }

    let data = null

    if (type === 'GET') {
        data = await getData()
    } else {
        data = await postData()
    }

    return data
}