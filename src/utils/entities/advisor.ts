import { accessAPI } from "../api"

export async function ReadAdvisors(query: any) {
    const advisors = await accessAPI('/advisors/read', 'POST', {'query': query})
    return advisors
}

export async function ReadAdvisorByAdvisorCode(advisorCode: number) {
    const advisors = await accessAPI('/database/read', 'POST', {
        'path': 'db/advisors/dictionary',
        'query': {
            'AdvisorCode': advisorCode
        }
    })
    if (advisors.length === 0) return null
    if (advisors.length > 1) throw new Error('Multiple advisors found.')
    return advisors[0]
}

export async function ReadAdvisorCommissions() {
    const commissions = await accessAPI('/advisors/commissions', 'GET')
    return commissions
}