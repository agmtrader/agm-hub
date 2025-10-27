import { accessAPI } from "../api"
import { Application, InternalApplication, InternalApplicationPayload } from "../../lib/entities/application"
import { IDResponse } from "@/lib/entities/base"

export async function CreateApplication(application: InternalApplicationPayload): Promise<IDResponse> {
    const createResponse: IDResponse = await accessAPI('/applications/create', 'POST', { 'application': application })
    return createResponse
}

export async function ReadApplications(stripApplication: 0 | 1 = 1): Promise<InternalApplication[]> {
    const applications: InternalApplication[] = await accessAPI(`/applications/read?strip_application=${stripApplication}`, 'GET')
    return applications
}

export async function ReadApplicationByID(applicationID: string): Promise<InternalApplication | null> {
    const applications: InternalApplication[] = await accessAPI(`/applications/read?id=${applicationID}`, 'GET')
    if (applications.length === 0) return null
    if (applications.length > 1) throw new Error('Multiple applications found for ID: ' + applicationID)
    return applications[0]
}

export async function ReadApplicationByLeadID(leadID: string): Promise<InternalApplication | null> {
    const applications: InternalApplication[] = await accessAPI(`/applications/read?lead_id=${leadID}`, 'GET')
    if (applications.length === 0) return null
    if (applications.length > 1) throw new Error('Multiple applications found for Lead ID: ' + leadID)
    return applications[0]
}

export async function ReadApplicationByUserID(userID: string): Promise<InternalApplication[]> { 
    const applications: InternalApplication[] = await accessAPI(`/applications/read?user_id=${userID}`, 'GET')
    return applications
}

export async function UpdateApplicationByID(applicationID: string, application: Partial<InternalApplication>): Promise<IDResponse> {
    const updateResponse: IDResponse = await accessAPI('/applications/update', 'POST', { 'query': { 'id': applicationID }, 'application': application })
    return updateResponse
}

// IBKR

export async function SendApplicationToIBKR(
    application: Application,
    masterAccount: 'ad' | 'br'
) {
    const response: any = await accessAPI('/applications/send_to_ibkr', 'POST', {
        application,
        master_account: masterAccount,
    })
    return response
}