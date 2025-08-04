import { accessAPI } from "../api"
import { Application, InternalApplication, InternalApplicationPayload } from "../../lib/entities/application"
import { POADocumentInfo } from "@/lib/entities/application"
import { IDResponse } from "@/lib/entities/base"

export async function CreateApplication(application: InternalApplicationPayload): Promise<IDResponse> {
    const createResponse: IDResponse = await accessAPI('/applications/create', 'POST', { 'application': application })
    return createResponse
}

export async function ReadApplications(): Promise<InternalApplication[]> {
    const applications: InternalApplication[] = await accessAPI('/applications/read', 'POST', { 'query': {} })
    return applications
}

export async function ReadApplicationByID(applicationID: string): Promise<InternalApplication | null> {
    const applications: InternalApplication[] = await accessAPI('/applications/read', 'POST', { 'query': { 'id': applicationID } })
    if (applications.length === 0) return null
    if (applications.length > 1) throw new Error('Multiple applications found for ID: ' + applicationID)
    return applications[0]
}

export async function ReadApplicationByLeadID(leadID: string): Promise<InternalApplication | null> {
    const applications: InternalApplication[] = await accessAPI('/applications/read', 'POST', { 'query': { 'lead_id': leadID } })
    if (applications.length === 0) return null
    if (applications.length > 1) throw new Error('Multiple applications found for Lead ID: ' + leadID)
    return applications[0]
}

export async function UpdateApplicationByID(applicationID: string, application: Partial<InternalApplication>): Promise<IDResponse> {
    const updateResponse: IDResponse = await accessAPI('/applications/update', 'POST', { 'query': { 'id': applicationID }, 'application': application })
    return updateResponse
}

export async function SendApplicationToIBKR(application: Application) {
    const response: any = await accessAPI('/applications/send_to_ibkr', 'POST', { 
        'application': application 
    })
    return response
}