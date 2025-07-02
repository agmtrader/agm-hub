import { Lead, LeadPayload } from "@/lib/entities/lead"
import { FollowUpPayload } from "@/lib/entities/lead"
import { accessAPI } from "../api"
import { FollowUp } from "@/lib/entities/lead"
import { IDResponse } from "./application"

export async function CreateLead(lead:LeadPayload, follow_ups:FollowUpPayload[]): Promise<IDResponse> {
    const createResponse: IDResponse = await accessAPI('/leads/create', 'POST', {'lead': lead, 'follow_ups': follow_ups})
    return createResponse
}

export async function ReadLeads() {
    let leadsWithFollowUps: {leads: Lead[], follow_ups: FollowUp[]} = await accessAPI('/leads/read', 'POST', {'query': {}})
    return leadsWithFollowUps
}

export async function ReadFollowUpsByLeadID(leadID:string) {
    let followUps:FollowUp[] = await accessAPI('/leads/read_follow_ups', 'POST', {'query': {'lead_id': leadID}})
    return followUps
}

export async function ReadLeadByID(leadID:string) {
    let leadsWithFollowUps: {leads: Lead[], follow_ups: FollowUp[]} = await accessAPI('/leads/read', 'POST', {'query': {'id': leadID}})
    return leadsWithFollowUps
}

export async function UpdateLeadByID(leadID:string, lead:any): Promise<IDResponse> {
    let updateResponse: IDResponse = await accessAPI('/leads/update', 'POST', {'query': {'id': leadID}, 'lead': lead})
    return updateResponse
}

export async function UpdateLeadFollowUpByID(leadID:string, followUp:FollowUpPayload): Promise<IDResponse> {
    let updateResponse: IDResponse = await accessAPI('/leads/update_follow_up', 'POST', {'lead_id': leadID, 'follow_up': followUp})
    return updateResponse
}

export async function DeleteLeadByID(leadID:string): Promise<IDResponse> {
    let deleteResponse: IDResponse = await accessAPI('/leads/delete', 'POST', {'query': {'id': leadID}})
    return deleteResponse
}