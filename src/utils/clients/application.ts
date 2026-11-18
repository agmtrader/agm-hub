import { getDefaults } from "../form"
import z from "zod"

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
                    sameMailAddress: true,
                    mailingAddress: null,
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
                    sameMailAddress: true,
                    mailingAddress: null,
                    w8Ben: { ...defaultW8Ben }
                }],
                secondHolderDetails: [{
                    sameMailAddress: true,
                    mailingAddress: null,
                    w8Ben: { ...defaultW8Ben }
                }],
                regulatoryInformation: defaultRegulatoryInfo,
            },
            organization: {
                associatedEntities: {
                    associatedIndividuals: [{
                        sameMailAddress: true,
                        mailingAddress: null,
                        w8Ben: { ...defaultW8Ben }
                    }]
                },
                regulatoryInformation: defaultRegulatoryInfo,
            }
        }
    }
}
