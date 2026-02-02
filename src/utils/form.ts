import { z } from 'zod'

export function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
    return Object.fromEntries(
        Object.entries(schema.shape).map(([key, value]) => {
            if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()]
            return [key, null]
        })
    )
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