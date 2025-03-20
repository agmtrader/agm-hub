import { accessAPI } from "../api"

export async function ReadAdvisors(query: any) {
    const advisors = await accessAPI('/advisors/read', 'POST', {'query': query})
    return advisors
}

export async function ReadAdvisorCommissions() {
    const commissions = await accessAPI('/advisors/commissions', 'GET')
    return commissions
}

export async function ReadAdvisorByAdvisorCode(advisorCode: number) {
    const advisors = await accessAPI('/advisors/read', 'POST', {'query': {'AdvisorCode': advisorCode}})
    return advisors
}