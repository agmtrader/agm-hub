import { accessAPI } from "../api"
import { Application, InternalApplication, InternalApplicationPayload } from "../../lib/entities/application"
import { IDResponse } from "@/lib/entities/base"

export async function CreateApplication(application: InternalApplicationPayload): Promise<IDResponse> {
    const createResponse: IDResponse = await accessAPI('/applications/create', 'POST', { 'application': application })
    return createResponse
}

/**
 * Fetch a list of applications. By default the heavy `application` IBKR payload is *stripped* from
 * the response to minimise network transfer size. Set `includeApplication` to `true` if you need
 * the full payload.
 */
export async function ReadApplications(includeApplication: boolean = false): Promise<InternalApplication[]> {
    const stripParam = includeApplication ? 'false' : 'true'
    const applications: InternalApplication[] = await accessAPI(`/applications/read?strip_application=${stripParam}`, 'GET')
    return applications
}

export async function ReadApplicationByID(applicationID: string): Promise<InternalApplication | null> {
    // We need the full application payload for a single record view so ask the API NOT to strip it
    const applications: InternalApplication[] = await accessAPI(`/applications/read?id=${applicationID}&strip_application=false`, 'GET')
    console.log(applications)
    if (applications.length === 0) return null
    if (applications.length > 1) throw new Error('Multiple applications found for ID: ' + applicationID)
    return applications[0]
}

export async function ReadApplicationByLeadID(leadID: string): Promise<InternalApplication | null> {
    const applications: InternalApplication[] = await accessAPI(`/applications/read?lead_id=${leadID}&strip_application=false`, 'GET')
    if (applications.length === 0) return null
    if (applications.length > 1) throw new Error('Multiple applications found for Lead ID: ' + leadID)
    return applications[0]
}

export async function ReadApplicationByUserID(userID: string): Promise<InternalApplication[]> { 
    const applications: InternalApplication[] = await accessAPI(`/applications/read?user_id=${userID}&strip_application=false`, 'GET')
    return applications
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