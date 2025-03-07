import { accessAPI } from "../api"

export async function ReadAdvisors() {
    const advisors = await accessAPI('/database/read', 'POST', {
        'path': 'db/advisors/dictionary',
        'params': {}
    })
    return advisors
}