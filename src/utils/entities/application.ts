import { accessAPI } from "../api"
import { AllForms, Application, FormDetails, InternalApplication } from "../../lib/entities/application"
import { PendingTasksResponse } from "@/lib/entities/account"

export async function CreateApplication(application: InternalApplication): Promise<Application> {
    const response: Application = await accessAPI('/applications/create', 'POST', { 'application': application })
    return response
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

export async function SendApplicationToIBKR(application: Application) {
    const response: any = await accessAPI('/applications/send_to_ibkr', 'POST', { 
        'application': {
            'application': application 
        }
    })
    return response
}

export async function GetFormsForApplication(forms: string[]): Promise<AllForms> {
    const response: AllForms = await accessAPI('/applications/forms', 'POST', { 'forms': forms })
    return response
}