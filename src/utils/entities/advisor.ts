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

export async function ReadAdvisorByID(id: string): Promise<Advisor | null> {
    const advisors: Advisor[] = await accessAPI(`/advisors/read?id=${id}`, 'GET')
    if (!advisors || advisors.length === 0) return null
    if (advisors.length > 1) throw new Error('Multiple advisors found with same ID')
    return advisors[0]
}