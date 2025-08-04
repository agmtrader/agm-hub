import { accessAPI } from "../api"

export async function ReadAdvisors() {
    const advisors = await accessAPI('/advisors/read', 'GET')
    return advisors
}

export async function ReadAdvisorCommissions() {
    const commissions = await accessAPI('/advisors/commissions', 'GET')
    return commissions
}