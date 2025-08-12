import { AdvisorPayload, Advisor } from "@/lib/entities/advisor"
import { accessAPI } from "../api"

export async function CreateAdvisor(advisor: AdvisorPayload): Promise<Advisor> {
    const advisorResponse: Advisor = await accessAPI('/advisors/create', 'POST', { 'advisor': advisor })
    return advisorResponse
}

export async function ReadAdvisors(): Promise<Advisor[]> {
    const advisors: Advisor[] = await accessAPI('/advisors/read', 'GET')
    return advisors
}

export async function ReadAdvisorCommissions() {
    const commissions = await accessAPI('/advisors/commissions', 'GET')
    return commissions
}