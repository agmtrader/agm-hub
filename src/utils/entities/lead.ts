import { Lead, LeadPayload } from "@/lib/entities/lead"
import { FollowUpPayload } from "@/lib/entities/lead"
import { accessAPI } from "../api"
import { FollowUp } from "@/lib/entities/lead"
import { IDResponse } from "@/lib/entities/base"

export async function CreateLead(lead:LeadPayload, follow_ups:FollowUpPayload[]): Promise<IDResponse> {
    const createResponse: IDResponse = await accessAPI('/leads/create', 'POST', {'lead': lead, 'follow_ups': follow_ups})
    return createResponse
}

export async function ReadLeads() {
    let leadsWithFollowUps: {leads: Lead[], follow_ups: FollowUp[]} = await accessAPI('/leads/read', 'GET')
    return leadsWithFollowUps
}

export async function ReadLeadByID(leadID:string) {
    let leadsWithFollowUps: {leads: Lead[], follow_ups: FollowUp[]} = await accessAPI(`/leads/read?id=${leadID}`, 'GET')
    return leadsWithFollowUps
}

export async function UpdateLeadByID(leadID:string, lead:Partial<LeadPayload>): Promise<IDResponse> {
    let updateResponse: IDResponse = await accessAPI('/leads/update', 'POST', {'query': {'id': leadID}, 'lead': lead})
    return updateResponse
}

// Create a follow-up for a given lead
export async function CreateLeadFollowUp(leadID: string, followUp: Omit<FollowUpPayload, 'lead_id'>): Promise<IDResponse> {
    const createResponse: IDResponse = await accessAPI('/leads/follow_up/create', 'POST', {
        'lead_id': leadID,
        'follow_up': followUp,
    })
    return createResponse
}

// Update an existing follow-up (requires the follow-up id in a separate param, per API spec)
export async function UpdateLeadFollowUpByID(
    leadID: string,
    followUpID: string,
    followUp: FollowUpPayload,
): Promise<IDResponse> {
    const updateResponse: IDResponse = await accessAPI('/leads/follow_up/update', 'POST', {
        'lead_id': leadID,
        'follow_up_id': followUpID,
        'follow_up': followUp,
    })
    return updateResponse
}

// Delete a follow-up by id
export async function DeleteLeadFollowUpByID(leadID: string, followUpID: string): Promise<IDResponse> {
    const deleteResponse: IDResponse = await accessAPI('/leads/follow_up/delete', 'POST', {
        'lead_id': leadID,
        'follow_up_id': followUpID,
    })
    return deleteResponse
}