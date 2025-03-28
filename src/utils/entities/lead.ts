import { Lead } from "@/lib/entities/lead"
import { accessAPI } from "../api"

export async function CreateLead(lead:Lead, id:string) {
    let lead_response = await accessAPI('/leads/create', 'POST', {'data': lead, 'id': id})
    return lead_response
}

export async function ReadLeads() {
    let leads:Lead[] = await accessAPI('/leads/read', 'POST', {'query': {}})
    return leads.sort((a, b) => (b.LeadID.toString().localeCompare(a.LeadID.toString())))   
}

export async function ReadLeadByID(leadID:string) {
    let leads:Lead[] = await accessAPI('/leads/read', 'POST', {'query': {'LeadID': leadID}})
    return leads.sort((a, b) => (b.LeadID.toString().localeCompare(a.LeadID.toString())))
}

export async function ReadLeadByUserID(userID:string) {
    let leads:Lead[] = await accessAPI('/leads/read', 'POST', {'query': {'UserID': userID}})
    return leads.sort((a, b) => (b.LeadID.toString().localeCompare(a.LeadID.toString())))
}

export async function UpdateLeadByID(leadID:string, data:any) {
    await accessAPI('/leads/update', 'POST', {'query': {'LeadID': leadID}, 'data': data})
    return 'Updated'
}