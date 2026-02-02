import { accessAPI } from "../api"
import { Application, InternalApplication, InternalApplicationPayload } from "../../lib/entities/application"
import { IDResponse } from "@/lib/entities/base"
import { getDefaults } from "../form"
import z from "zod"

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

export function getApplicationDefaults<Schema extends z.AnyZodObject>(schema: Schema) {

    const defaults = getDefaults(schema)
    const defaultW8Ben = {
        localTaxForms: [],
        name: "",
        foreignTaxId: "",
        tinOrExplanationRequired: true,
        part29ACountry: "N/A",
        cert: true,
        signatureType: "Electronic",
        blankForm: true,
        taxFormFile: "Form5001.pdf",
        electronicFormat: true,
    };
    
    const defaultRegulatoryInfo = [
        {
            regulatoryDetails: [
                {
                    code: "AFFILIATION",
                    status: false,
                    details: "Affiliated with Interactive Brokers"
                },
                {
                    code: "EmployeePubTrade",
                    status: false,
                    details: "Employee is not trading publicly"
                },
                {
                    code: "ControlPubTraded",
                    status: false,
                    details: "Controlled trading is not allowed"
                }
            ]
        }
    ];

    return {
        ...defaults,
        documents: [],
        accounts: [{
            tradingPermissions: [],
            multiCurrency: true,
            capabilities: [
                'CLP'
            ]
        }],
        customer: {
            accountHolder: {
                accountHolderDetails: [{
                    w8Ben: { ...defaultW8Ben }
                }],
                financialInformation: [{
                    sourcesOfWealth: [{ sourceType: 'SOW-IND-Income', percentage: 100 }],
                    investmentExperience: [{ assetClass: 'STK', yearsTrading: 1, tradesPerYear: 10, knowledgeLevel: 'Limited' }],
                    investmentObjectives: []
                }],
                regulatoryInformation: defaultRegulatoryInfo,
            },
            jointHolders: {
                firstHolderDetails: [{
                    w8Ben: { ...defaultW8Ben }
                }],
                secondHolderDetails: [{
                    w8Ben: { ...defaultW8Ben }
                }],
                regulatoryInformation: defaultRegulatoryInfo,
            },
            organization: {
                associatedEntities: {
                    associatedIndividuals: [{
                        w8Ben: { ...defaultW8Ben }
                    }]
                },
                regulatoryInformation: defaultRegulatoryInfo,
            }
        }
    }
}