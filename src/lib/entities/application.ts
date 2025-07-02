import { z } from 'zod';
import {
    application_schema,
    customer_schema,
    account_schema,
    user_schema,
    add_additional_account_schema,
    ibkr_document_schema,
    trading_limits_schema,
    order_value_limits_schema,
    efp_quantity_limits_schema,
    order_quantity_limit_schema,
    day_quantity_limit_schema,
    user_privilege_schema,
    individual_applicant_schema,
    joint_holders_schema,
    account_holder_details_schema,
    financial_information_schema,
    regulatory_information_schema,
    name_schema,
    address_schema,
    phone_schema,
    identification_schema,
    employment_details_schema,
    investment_experience_schema,
    source_of_wealth_schema,
    regulatory_detail_schema,
    trading_permission_schema,

    organization_schema,
    local_tax_form_schema,
    w8ben_schema
} from './schemas/application';
import { poa_schema, poi_schema, sow_schema } from './schemas/application';

export type POADocumentInfo = z.infer<typeof poa_schema>
export type POIDocumentInfo = z.infer<typeof poi_schema>
export type SOWDocumentInfo = z.infer<typeof sow_schema>

export type Application = z.infer<typeof application_schema>;
export type Customer = z.infer<typeof customer_schema>;
export type Account = z.infer<typeof account_schema>;
export type User = z.infer<typeof user_schema>;
export type AddAdditionalAccount = z.infer<typeof add_additional_account_schema>;
export type IBKRDocument = z.infer<typeof ibkr_document_schema>;
export type TradingLimits = z.infer<typeof trading_limits_schema>;
export type OrderValueLimits = z.infer<typeof order_value_limits_schema>;
export type EFPQuantityLimits = z.infer<typeof efp_quantity_limits_schema>;
export type OrderQuantityLimit = z.infer<typeof order_quantity_limit_schema>;
export type DayQuantityLimit = z.infer<typeof day_quantity_limit_schema>;
export type UserPrivilege = z.infer<typeof user_privilege_schema>;

export type LocalTaxForm = z.infer<typeof local_tax_form_schema>;
export type W8Ben = z.infer<typeof w8ben_schema>;

export type IndividualApplicant = z.infer<typeof individual_applicant_schema>;
export type JointHolders = z.infer<typeof joint_holders_schema>;
export type AccountHolderDetails = z.infer<typeof account_holder_details_schema>;
export type FinancialInformation = z.infer<typeof financial_information_schema>;
export type RegulatoryInformation = z.infer<typeof regulatory_information_schema>;

export type Name = z.infer<typeof name_schema>;
export type Address = z.infer<typeof address_schema>;
export type Phone = z.infer<typeof phone_schema>;
export type Identification = z.infer<typeof identification_schema>;
export type EmploymentDetails = z.infer<typeof employment_details_schema>;
export type InvestmentExperience = z.infer<typeof investment_experience_schema>;
export type SourceOfWealth = z.infer<typeof source_of_wealth_schema>;
export type RegulatoryDetail = z.infer<typeof regulatory_detail_schema>;
export type TradingPermission = z.infer<typeof trading_permission_schema>;


export type Organization = z.infer<typeof organization_schema>;

export interface InternalApplication {
    id: string;
    advisor_id: string | null;
    master_account_id: string | null;
    lead_id: string | null;
    application: Application;
    created: string;
    updated: string;
    date_sent_to_ibkr: string | null;
    user_id: string | null;
}

const external_id = Math.random().toString(36).substring(2, 12)
const user_name = "Javier"
const user_last_names = "Cordero Sancho"
const user_email = `${Math.random().toString(36).substring(2, 8)}@gmail.com`
const prefix = `askjgn`

console.log(external_id)
console.log(user_email)
console.log(prefix)

export const application: Application = {
    "customer": {
        "accountHolder": {
            "accountHolderDetails": [
                {
                    "externalId": external_id,
                    "email": user_email,
                    "name": {
                        "first": user_name,
                        "last": user_last_names,
                        "salutation": "Mr.",
                    },
                    "dateOfBirth": "2002-07-24",
                    "countryOfBirth": "CRI",
                    "numDependents": 0,
                    "maritalStatus": "S",
                    "identification": {
                        "passport": "118490741",
                        "issuingCountry": "CRI",
                        "expirationDate": "2030-07-24",
                        "citizenship": "CRI"
                    },
                    "residenceAddress": {
                        "country": "CRI",
                        "street1": "Valle del Sol",
                        "city": "San Jose",
                        "state": "CR-SJ",
                        "postalCode": "10301"
                    },
                    "phones": [
                        {
                            "type": "Mobile",
                            "country": "CRI",
                            "number": "83027366",
                            "verified": true
                        }
                    ],
                    "employmentType": "EMPLOYED",
                    "employmentDetails": {
                        "employerBusiness": "Finance",
                        "employer": "AGM Technology",
                        "occupation": "Software Engineer",
                        "employerAddress": {
                            "country": "CRI",
                            "street1": "Hype Way",
                            "street2": "",
                            "city": "Escazu",
                            "state": "CR-SJ",
                            "postalCode": "10301"
                        }
                    },
                    "taxResidencies": [
                        {
                          "country": "CRI",
                          "tin": "118490741",
                          "tinType": "NonUS_NationalId"
                        }
                    ],
                    "w8Ben": {
                        "localTaxForms": [],
                        "name": user_name + " " + user_last_names,
                        "foreignTaxId": "118490741",
                        "tinOrExplanationRequired": true,
                        "part29ACountry": "N/A",
                        "cert": true,
                        "signatureType": "Electronic",
                        "blankForm": true,
                        "taxFormFile": "Form5001.pdf",
                        "electronicFormat": true,
                    },
                    "gender": "M",
                    "sameMailAddress": true,
                    "titles": [
                        {
                            "code": "Account Holder",
                            "value": "Account Holder"
                        }
                    ]
                }
            ],
            "financialInformation": [
                {
                    "investmentExperience": [
                        {
                            "assetClass": "STK",
                            "yearsTrading": 1,
                            "tradesPerYear": 1,
                            "knowledgeLevel": "Good"
                        }
                    ],
                    "investmentObjectives": [
                        "Trading",
                        "Growth"
                    ],
                    "sourcesOfWealth": [
                        {
                            "sourceType": 'SOW-IND-Income',
                            "percentage": 100,
                            "usedForFunds": true
                        }
                    ],
                    "netWorth": 1000,
                    "liquidNetWorth": 1000,
                    "annualNetIncome": 1000,
                }
            ],
            "regulatoryInformation": [
                {
                    "regulatoryDetails": [
                        {
                            "code": "AFFILIATION",
                            "status": false,
                            "details": "Affiliated with Interactive Brokers",
                            "externalIndividualId": external_id
                        },
                        {
                            "code": "EmployeePubTrade",
                            "status": false,
                            "details": "Employee is not trading publicly",
                            "externalIndividualId": external_id
                        },
                        {
                            "code": "ControlPubTraded",
                            "status": false,
                            "details": "Controlled trading is not allowed",
                            "externalIndividualId": external_id
                        }
                    ]
                }
            ],
        },
        "externalId": external_id,
        "type": "INDIVIDUAL",
        "prefix": prefix,
        "email": user_email,
        "mdStatusNonPro": true,
        "meetAmlStandard": "true",
        "directTradingAccess": true,
        "legalResidenceCountry": "CRI"
    },
    "accounts": [
        {
            "investmentObjectives": [
                "Trading",
                "Growth"
            ],
            "tradingPermissions": [
                {
                    "country": "UNITED STATES",
                    "product": "STOCKS"
                }
            ],
            "externalId": external_id,
            "baseCurrency": "USD",
            "multiCurrency": true,
            "margin": "Cash",
            "alias": "AGM"
        },
    ],
    "users": [
        {
            "externalUserId": external_id,
            "externalIndividualId": external_id,
            "prefix": prefix
        } 
    ],
    "documents": [
    ]
}

// Joint Account Testing Structure
const joint_external_id_1 = Math.random().toString(36).substring(2, 12)
const joint_external_id_2 = Math.random().toString(36).substring(2, 12)
const joint_user_name_1 = "Maria"
const joint_user_last_names_1 = "Rodriguez Garcia"
const joint_user_name_2 = "Carlos"
const joint_user_last_names_2 = "Mendez Lopez"
const joint_user_email_1 = `${Math.random().toString(36).substring(2, 8)}@gmail.com`
const joint_user_email_2 = `${Math.random().toString(36).substring(2, 8)}@gmail.com`
const joint_prefix = `joints`

console.log('Joint Account Testing Data:')
console.log('First Holder ID:', joint_external_id_1)
console.log('Second Holder ID:', joint_external_id_2)
console.log('First Holder Email:', joint_user_email_1)
console.log('Second Holder Email:', joint_user_email_2)
console.log('Joint Prefix:', joint_prefix)

export const jointApplication: Application = {
    "customer": {
        "jointHolders": {
            "firstHolderDetails": [
                {
                    "externalId": joint_external_id_1,
                    "email": joint_user_email_1,
                    "name": {
                        "first": joint_user_name_1,
                        "last": joint_user_last_names_1,
                        "salutation": "Ms.",
                    },
                    "dateOfBirth": "1990-03-15",
                    "countryOfBirth": "CRI",
                    "numDependents": 1,
                    "maritalStatus": "M",
                    "identification": {
                        "passport": "221334567",
                        "issuingCountry": "CRI",
                        "expirationDate": "2031-03-15",
                        "citizenship": "CRI"
                    },
                    "residenceAddress": {
                        "country": "CRI",
                        "street1": "Avenida Escazu",
                        "city": "Escazu",
                        "state": "CR-SJ",
                        "postalCode": "10201"
                    },
                    "phones": [
                        {
                            "type": "Mobile",
                            "country": "CRI",
                            "number": "87654321",
                            "verified": true
                        }
                    ],
                    "employmentType": "EMPLOYED",
                    "employmentDetails": {
                        "employerBusiness": "Healthcare",
                        "employer": "Hospital Nacional",
                        "occupation": "Doctor",
                        "employerAddress": {
                            "country": "CRI",
                            "street1": "Hospital Avenue",
                            "street2": "",
                            "city": "San Jose",
                            "state": "CR-SJ",
                            "postalCode": "10101"
                        }
                    },
                    "taxResidencies": [
                        {
                          "country": "CRI",
                          "tin": "221334567",
                          "tinType": "NonUS_NationalId"
                        }
                    ],
                    "gender": "F",
                    "sameMailAddress": true,
                    "titles": [
                        {
                            "code": "Account Holder",
                            "value": "Account Holder"
                        }
                    ]
                }
            ],
            "secondHolderDetails": [
                {
                    "externalId": joint_external_id_2,
                    "email": joint_user_email_2,
                    "name": {
                        "first": joint_user_name_2,
                        "last": joint_user_last_names_2,
                        "salutation": "Mr.",
                    },
                    "dateOfBirth": "1988-07-22",
                    "countryOfBirth": "CRI",
                    "numDependents": 1,
                    "maritalStatus": "M",
                    "identification": {
                        "passport": "334567890",
                        "issuingCountry": "CRI",
                        "expirationDate": "2032-07-22",
                        "citizenship": "CRI"
                    },
                    "residenceAddress": {
                        "country": "CRI",
                        "street1": "Avenida Escazu",
                        "city": "Escazu",
                        "state": "CR-SJ",
                        "postalCode": "10201"
                    },
                    "phones": [
                        {
                            "type": "Mobile",
                            "country": "CRI",
                            "number": "89123456",
                            "verified": true
                        }
                    ],
                    "employmentType": "EMPLOYED",
                    "employmentDetails": {
                        "employerBusiness": "Engineering",
                        "employer": "Tech Solutions CR",
                        "occupation": "Civil Engineer",
                        "employerAddress": {
                            "country": "CRI",
                            "street1": "Tech Park",
                            "street2": "",
                            "city": "Heredia",
                            "state": "CR-H",
                            "postalCode": "40101"
                        }
                    },
                    "taxResidencies": [
                        {
                          "country": "CRI",
                          "tin": "334567890",
                          "tinType": "NonUS_NationalId"
                        }
                    ],
                    "gender": "M",
                    "sameMailAddress": true,
                    "titles": [
                        {
                            "code": "Account Holder",
                            "value": "Account Holder"
                        }
                    ]
                }
            ],
            "financialInformation": [
                {
                    "investmentExperience": [
                        {
                            "assetClass": "STK",
                            "yearsTrading": 3,
                            "tradesPerYear": 12,
                            "knowledgeLevel": "Extensive"
                        },
                        {
                            "assetClass": "BOND",
                            "yearsTrading": 2,
                            "tradesPerYear": 6,
                            "knowledgeLevel": "Good"
                        }
                    ],
                    "investmentObjectives": [
                        "Trading",
                        "Growth"
                    ],
                    "sourcesOfWealth": [
                        {
                            "sourceType": 'SOW-IND-Income',
                            "percentage": 70,
                            "usedForFunds": true
                        },
                        {
                            "sourceType": 'SOW-IND-Inheritance',
                            "percentage": 30,
                            "usedForFunds": true
                        }
                    ],
                    "netWorth": 150000,
                    "liquidNetWorth": 75000,
                    "annualNetIncome": 85000,
                }
            ],
            "regulatoryInformation": [
                {
                    "regulatoryDetails": [
                        {
                            "code": "AFFILIATION",
                            "status": false,
                            "details": "Affiliated with Interactive Brokers",
                            "externalIndividualId": external_id
                        },
                        {
                            "code": "EmployeePubTrade",
                            "status": false,
                            "details": "Employee is not trading publicly",
                            "externalIndividualId": external_id
                        },
                        {
                            "code": "ControlPubTraded",
                            "status": false,
                            "details": "Controlled trading is not allowed",
                            "externalIndividualId": external_id
                        }
                    ]
                }
            ],
            "type": "joint_tenants"
        },
        "externalId": joint_external_id_1, // Primary holder's ID for customer
        "type": "JOINT",
        "prefix": joint_prefix,
        "email": joint_user_email_1, // Primary holder's email for customer
        "mdStatusNonPro": true,
        "meetAmlStandard": "true",
        "directTradingAccess": true,
        "legalResidenceCountry": "CRI"
    },
    "accounts": [
        {
            "investmentObjectives": [
                "Trading",
                "Growth"
            ],
            "tradingPermissions": [
                {
                    "country": "UNITED STATES",
                    "product": "STOCKS"
                },
                {
                    "country": "UNITED STATES",
                    "product": "BONDS"
                }
            ],
            "externalId": joint_external_id_1,
            "baseCurrency": "USD",
            "multiCurrency": true,
            "margin": "RegTMargin",
            "alias": "AGM Joint"
        },
    ],
    "users": [
        {
            "externalUserId": joint_external_id_1,
            "externalIndividualId": joint_external_id_1,
            "prefix": joint_prefix
        },
        {
            "externalUserId": joint_external_id_2,
            "externalIndividualId": joint_external_id_2,
            "prefix": joint_prefix
        }
    ],
}

// Organization Account Testing Structure
const org_external_id = Math.random().toString(36).substring(2, 12)
const org_prefix = `orgs`
const org_email = `${Math.random().toString(36).substring(2, 8)}@gmail.com`

console.log('Organization Account Testing Data:')
console.log('Organization External ID:', org_external_id)
console.log('Organization Email:', org_email)
console.log('Organization Prefix:', org_prefix)

export const organizationApplication: Application = {
    customer: {
        organization: {
            identifications: [
                {
                    placeOfBusinessAddress: {
                        street1: "123 Business Rd",
                        city: "San Jose",
                        state: "CR-SJ",
                        country: "CRI",
                        postalCode: "10101",
                    },
                    mailingAddress: {
                        street1: "123 Business Rd",
                        city: "San Jose",
                        state: "CR-SJ",
                        country: "CRI",
                        postalCode: "10101",
                    },
                    phones: [
                        {
                            type: "Work",
                            number: "22223333",
                            country: "CRI",
                            verified: true,
                        },
                    ],
                    name: "AGM Tech Corp",
                    businessDescription: "Software Development",
                    identification: org_external_id,
                    identificationCountry: "CRI",
                    formationCountry: "CRI",
                    formationState: "CR-SJ",
                    sameMailAddress: true,
                    translated: true,
                },
            ],
            accountSupport: {
                businessDescription: "Technology Services",
                ownersResideUS: false,
                type: "CORPORATION",
            },
            associatedEntities: {
                associatedIndividuals: [
                    {
                        numDependents: 0,
                        externalId: Math.random().toString(36).substring(2, 12),
                        email: `${Math.random().toString(36).substring(2, 8)}@gmail.com`,
                        name: {
                            salutation: "Mr.",
                            first: "Carlos",
                            last: "Jimenez",
                        },
                        dateOfBirth: "1985-04-12",
                        countryOfBirth: "CRI",
                        gender: "M",
                        maritalStatus: "M",
                        residenceAddress: {
                            street1: "Ciudad Colon",
                            city: "San Jose",
                            state: "CR-SJ",
                            country: "CRI",
                            postalCode: "10501",
                        },
                        phones: [
                            {
                                type: "Mobile",
                                number: "83334444",
                                country: "CRI",
                                verified: true,
                            },
                        ],
                        identification: {
                            passport: "445566778",
                            issuingCountry: "CRI",
                            expirationDate: "2033-04-12",
                            citizenship: "CRI",
                        },
                        employmentType: "EMPLOYED",
                        employmentDetails: {
                            employerBusiness: "Technology",
                            employer: "AGM Tech Corp",
                            occupation: "Director",
                            employerAddress: {
                                country: "CRI",
                                street1: "Business Rd 123",
                                city: "San Jose",
                                state: "CR-SJ",
                                postalCode: "10101",
                            },
                        },
                        taxResidencies: [
                            {
                                country: "CRI",
                                tin: "445566778",
                                tinType: "NonUS_NationalId",
                            },
                        ],
                        sameMailAddress: true,
                        titles: [
                            {
                                value: "Director",
                                code: "Director",
                            },
                        ],
                    },
                ],
                associatedEntities: [],
            },
            financialInformation: [
                {
                    investmentExperience: [
                        {
                            assetClass: "STK",
                            yearsTrading: 5,
                            tradesPerYear: 50,
                            knowledgeLevel: "Extensive",
                        },
                    ],
                    investmentObjectives: ["Growth"],
                    sourcesOfWealth: [
                        {
                            sourceType: "SOW-IND-Income",
                            percentage: 100,
                            usedForFunds: true,
                        },
                    ],
                    netWorth: 500000,
                    liquidNetWorth: 250000,
                    annualNetIncome: 100000,
                },
            ],
            regulatoryInformation: [
                {
                    regulatoryDetails: [
                        {
                            code: "AFFILIATION",
                            status: false,
                            details: "No affiliations",
                        },
                    ],
                },
            ],
        },
        externalId: org_external_id,
        type: "ORG",
        prefix: org_prefix,
        email: org_email,
        mdStatusNonPro: true,
        meetAmlStandard: "true",
        directTradingAccess: true,
        legalResidenceCountry: "CRI",
    },
    accounts: [
        {
            investmentObjectives: ["Growth", "Trading"],
            tradingPermissions: [
                {
                    country: "UNITED STATES",
                    product: "STOCKS",
                },
                {
                    country: "UNITED STATES",
                    product: "BONDS",
                },
            ],
            externalId: org_external_id,
            baseCurrency: "USD",
            multiCurrency: true,
            margin: "RegTMargin",
            alias: "AGM ORG",
        },
    ],
    users: [
        {
            externalUserId: org_external_id,
            externalIndividualId: org_external_id,
            prefix: org_prefix,
        },
    ],
    documents: [],
}

