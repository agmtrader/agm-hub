import { Application } from "@/lib/entities/application"

// Generate UUIDv4
const external_id = Math.random().toString(36).substring(2, 12)
export const individual_form: Application = {
    "customer": {
        "type": "INDIVIDUAL",
        "externalId": external_id,
        "prefix": "aguila",
        "email": "aguilarcarboni@gmail.com",
        "mdStatusNonPro": true,
        "meetAmlStandard": "true",
        "directTradingAccess": true,
        "legalResidenceCountry": "CRI",
        "accountHolder": {
            "accountHolderDetails": [
                {
                    "w8Ben": {
                        "localTaxForms": [],
                        "name": "Andres Aguilar",
                        "foreignTaxId": "118490741",
                        "tinOrExplanationRequired": true,
                        "part29ACountry": "N/A",
                        "cert": true,
                        "signatureType": "Electronic",
                        "blankForm": true,
                        "taxFormFile": "Form5001.pdf",
                        "electronicFormat": true
                    },
                    "name": {
                        "first": "Andres",
                        "last": "Aguilar"
                    },
                    "email": "aguilarcarboni@gmail.com",
                    "dateOfBirth": "2002-08-24",
                    "countryOfBirth": "CRI",
                    "maritalStatus": "S",
                    "numDependents": 100,
                    "residenceAddress": {
                        "street1": "The Oasis",
                        "street2": ".",
                        "city": "La Union",
                        "state": "CR-C",
                        "postalCode": "30301",
                        "country": "CRI"
                    },
                    "sameMailAddress": true,
                    "phones": [
                        {
                            "type": "Mobile",
                            "country": "CRI",
                            "number": "83027366"
                        }
                    ],
                    "identification": {
                        "expirationDate": "2027-08-27",
                        "issuingCountry": "CRI",
                        "citizenship": "CRI",
                        "passport": "118490741"
                    },
                    "taxResidencies": [
                        {
                            "country": "CRI",
                            "tin": "118490741",
                            "tinType": "NonUS_NationalId"
                        }
                    ],
                    "employmentType": "UNEMPLOYED",
                    "externalId": external_id,
                    "employmentDetails": null,
                    "mailingAddress": {
                        "street1": "The Oasis",
                        "street2": ".",
                        "city": "La Union",
                        "state": "CR-C",
                        "postalCode": "30301",
                        "country": "CRI"
                    }
                }
            ],
            "regulatoryInformation": [
                {
                    "regulatoryDetails": [
                        {
                            "code": "AFFILIATION",
                            "status": false,
                            "details": "Affiliated with Interactive Brokers"
                        },
                        {
                            "code": "EmployeePubTrade",
                            "status": false,
                            "details": "Employee is not trading publicly"
                        },
                        {
                            "code": "ControlPubTraded",
                            "status": false,
                            "details": "Controlled trading is not allowed"
                        }
                    ]
                }
            ],
            "financialInformation": [
                {
                    "netWorth": 100000,
                    "liquidNetWorth": 25000,
                    "annualNetIncome": 100000,
                    "investmentObjectives": [
                        "Growth"
                    ],
                    "investmentExperience": [
                        {
                            "assetClass": "BOND",
                            "yearsTrading": 5,
                            "tradesPerYear": 3,
                            "knowledgeLevel": "Good"
                        }
                    ],
                    "sourcesOfWealth": [
                        {
                            "sourceType": "SOW-IND-Income",
                            "percentage": 100
                        }
                    ]
                }
            ]
        }
    },
    "accounts": [
        {
            "baseCurrency": "USD",
            "margin": "Cash",
            "investmentObjectives": [
                "Growth"
            ],
            "tradingPermissions": [
                {
                    "country": "UNITED STATES",
                    "product": "BONDS"
                }
            ],
            "multiCurrency": true,
            "externalId": external_id
        }
    ],
    "users": [
        {
            "externalUserId": external_id,
            "externalIndividualId": external_id,
            "prefix": "elen"
        }
    ],
    "additionalAccounts": null,
    "masterAccountId": null,
    "id": null,
    "inputLanguage": null,
    "translation": null,
    "paperAccount": null
}

const joint_external_id_1 = Math.random().toString(36).substring(2, 12)
const joint_external_id_2 = Math.random().toString(36).substring(2, 12)
export const joint_form: Application = {
    "customer": {
        "type": "JOINT",
        "externalId": joint_external_id_1,
        "prefix": "ansdf",
        "email": "aguilarcarboni@gmail.com",
        "mdStatusNonPro": true,
        "meetAmlStandard": "true",
        "directTradingAccess": true,
        "legalResidenceCountry": "COM",
        "jointHolders": {
            "firstHolderDetails": [
                {
                    "w8Ben": {
                        "localTaxForms": [],
                        "name": "Andres Rodriguez Garcia",
                        "foreignTaxId": "11940491284",
                        "tinOrExplanationRequired": true,
                        "part29ACountry": "N/A",
                        "cert": true,
                        "signatureType": "Electronic",
                        "blankForm": true,
                        "taxFormFile": "Form5001.pdf",
                        "electronicFormat": true
                    },
                    "name": {
                        "first": "Andres",
                        "last": "Rodriguez Garcia"
                    },
                    "email": "aguilarcarboni@gmail.com",
                    "dateOfBirth": "2025-08-07",
                    "countryOfBirth": "CRI",
                    "maritalStatus": "S",
                    "numDependents": 1,
                    "residenceAddress": {
                        "street1": "Avenida Escazu",
                        "street2": null,
                        "city": "Escazu",
                        "state": "CR-SJ",
                        "postalCode": "10201",
                        "country": "CRI"
                    },
                    "sameMailAddress": true,
                    "phones": [
                        {
                            "type": "Mobile",
                            "country": "CRI",
                            "number": "87654321"
                        }
                    ],
                    "identification": {
                        "expirationDate": "2025-08-14",
                        "issuingCountry": "CRI",
                        "citizenship": "CRI",
                        "nationalCard": "1123123123"
                    },
                    "taxResidencies": [
                        {
                            "country": "CRI",
                            "tin": "11940491284",
                            "tinType": "NonUS_NationalId"
                        }
                    ],
                    "employmentType": "UNEMPLOYED",
                    "externalId": joint_external_id_1,
                    "mailingAddress": {
                        "street1": "Avenida Escazu",
                        "street2": null,
                        "city": "Escazu",
                        "state": "CR-SJ",
                        "postalCode": "10201",
                        "country": "CRI"
                    },
                    "employmentDetails": null
                }
            ],
            "secondHolderDetails": [
                {
                    "w8Ben": {
                        "localTaxForms": [],
                        "name": "Carlos Mendez",
                        "foreignTaxId": "123123123",
                        "tinOrExplanationRequired": true,
                        "part29ACountry": "N/A",
                        "cert": true,
                        "signatureType": "Electronic",
                        "blankForm": true,
                        "taxFormFile": "Form5001.pdf",
                        "electronicFormat": true
                    },
                    "name": {
                        "first": "Carlos",
                        "last": "Mendez"
                    },
                    "email": "yntis0@gmail.com",
                    "dateOfBirth": "2025-08-22",
                    "countryOfBirth": "CRI",
                    "maritalStatus": "S",
                    "numDependents": 1,
                    "residenceAddress": {
                        "street1": "Avenida Escazu",
                        "street2": null,
                        "city": "Escazu",
                        "state": "CR-SJ",
                        "postalCode": "10201",
                        "country": "ARG"
                    },
                    "sameMailAddress": true,
                    "phones": [
                        {
                            "type": "Mobile",
                            "country": "ALB",
                            "number": "89123456"
                        }
                    ],
                    "identification": {
                        "expirationDate": "2025-07-18",
                        "issuingCountry": "CRI",
                        "citizenship": "AFG",
                        "nationalCard": "123123123"
                    },
                    "taxResidencies": [
                        {
                            "country": "CRI",
                            "tin": "123123123",
                            "tinType": "NonUS_NationalId"
                        }
                    ],
                    "employmentType": "UNEMPLOYED",
                    "externalId": joint_external_id_2,
                    "mailingAddress": {
                        "street1": "Avenida Escazu",
                        "street2": null,
                        "city": "Escazu",
                        "state": "CR-SJ",
                        "postalCode": "10201",
                        "country": "ARG"
                    },
                    "employmentDetails": null
                }
            ],
            "regulatoryInformation": [
                {
                    "regulatoryDetails": [
                        {
                            "code": "AFFILIATION",
                            "status": false,
                            "details": ""
                        },
                        {
                            "code": "EmployeePubTrade",
                            "status": false,
                            "details": "Employee is not trading publicly"
                        },
                        {
                            "code": "ControlPubTraded",
                            "status": false,
                            "details": "Controlled trading is not allowed"
                        }
                    ]
                }
            ],
            "type": "joint_tenants",
            "financialInformation": [
                {
                    "netWorth": 150000,
                    "liquidNetWorth": 75000,
                    "annualNetIncome": 85000,
                    "investmentObjectives": [
                        "Growth"
                    ],
                    "investmentExperience": [
                        {
                            "assetClass": "STK",
                            "yearsTrading": 5,
                            "tradesPerYear": 35,
                            "knowledgeLevel": "None"
                        }
                    ],
                    "sourcesOfWealth": [
                        {
                            "sourceType": "SOW-IND-Income",
                            "percentage": 100
                        }
                    ]
                }
            ]
        }
    },
    "accounts": [
        {
            "baseCurrency": "USD",
            "margin": "Cash",
            "investmentObjectives": [
                "Growth"
            ],
            "tradingPermissions": [
                {
                    "country": "UNITED KINGDOM",
                    "product": "BONDS"
                }
            ],
            "multiCurrency": true,
            "externalId": joint_external_id_1
        }
    ],
    "users": [
        {
            "externalUserId": joint_external_id_1,
            "externalIndividualId": joint_external_id_1,
            "prefix": "ansdf"
        }
    ],
    "additionalAccounts": null,
    "masterAccountId": null,
    "id": null,
    "inputLanguage": null,
    "translation": null,
    "paperAccount": null
}

// Organization Account Testing Structure
const org_external_id = Math.random().toString(36).substring(2, 12)
export const organizational_form: Application = {
    "customer": {
        "type": "ORG",
        "externalId": org_external_id,
        "prefix": 'orgs',
        "email": `agilarcarboni@gmail.com`,
        "mdStatusNonPro": true,
        "meetAmlStandard": "true",
        "directTradingAccess": true,
        "legalResidenceCountry": "CRI",
        "organization": {
            "associatedEntities": {
                "associatedIndividuals": [
                    {
                        "w8Ben": {
                            "localTaxForms": [],
                            "name": "Andres Aguilar",
                            "foreignTaxId": "118490741",
                            "tinOrExplanationRequired": true,
                            "part29ACountry": "N/A",
                            "cert": true,
                            "signatureType": "Electronic",
                            "blankForm": true,
                            "taxFormFile": "Form5001.pdf",
                            "electronicFormat": true
                        },
                        "name": {
                            "first": "Andres",
                            "last": "Aguilar"
                        },
                        "email": "aguilarcarboni@gmail.com",
                        "dateOfBirth": "2002-07-24",
                        "countryOfBirth": "CRI",
                        "maritalStatus": "S",
                        "numDependents": 0,
                        "residenceAddress": {
                            "street1": "The Oasis",
                            "street2": null,
                            "city": "La Union",
                            "state": "CR-C",
                            "postalCode": "30301",
                            "country": "CRI"
                        },
                        "phones": [
                            {
                                "type": "Mobile",
                                "country": "CRI",
                                "number": "83027366"
                            }
                        ],
                        "externalId": org_external_id,
                        "identification": {
                            "expirationDate": "2030-07-24",
                            "issuingCountry": "CRI",
                            "citizenship": "CRI",
                            "passport": "118490741"
                        },
                        "taxResidencies": [
                            {
                                "country": "CRI",
                                "tin": "118490741",
                                "tinType": "NonUS_NationalId"
                            }
                        ],
                        "employmentType": "EMPLOYED",
                        "employmentDetails": {
                            "employer": "AGM Technology",
                            "occupation": "Software",
                            "employerBusiness": "Technology",
                            "employerAddress": {
                                "street1": "Hype Way",
                                "street2": null,
                                "city": "San Jose",
                                "state": "CR-SJ",
                                "postalCode": "10101",
                                "country": "CRI"
                            }
                        }
                    }
                ]
            },
            "regulatoryInformation": [
                {
                    "regulatoryDetails": [
                        {
                            "code": "AFFILIATION",
                            "status": false,
                            "details": "Affiliated with Interactive Brokers"
                        },
                        {
                            "code": "EmployeePubTrade",
                            "status": false,
                            "details": "Employee is not trading publicly"
                        },
                        {
                            "code": "ControlPubTraded",
                            "status": false,
                            "details": "Controlled trading is not allowed"
                        }
                    ]
                }
            ],
            "identifications": [
                {
                    "name": "AGM Tech Corp",
                    "businessDescription": "Software",
                    "identification": "qlin06mers",
                    "placeOfBusinessAddress": {
                        "street1": "123 Business Rd",
                        "street2": null,
                        "city": "San Jose",
                        "state": "CR-SJ",
                        "postalCode": "10101",
                        "country": "CRI"
                    }
                }
            ],
            "accountSupport": {
                "ownersResideUS": false,
                "businessDescription": "Software"
            },
            "financialInformation": [
                {
                    "netWorth": 10000,
                    "liquidNetWorth": 500000,
                    "annualNetIncome": 100000,
                    "investmentObjectives": [
                        "Growth"
                    ],
                    "investmentExperience": [
                        {
                            "assetClass": "STK",
                            "yearsTrading": 3,
                            "tradesPerYear": 25,
                            "knowledgeLevel": "Good"
                        }
                    ],
                    "sourcesOfWealth": [
                        {
                            "sourceType": "SOW-IND-Income",
                            "percentage": 100
                        }
                    ]
                }
            ]
        }
    },
    "accounts": [
        {
            "baseCurrency": "USD",
            "margin": "Cash",
            "investmentObjectives": [
                "Growth"
            ],
            "tradingPermissions": [
                {
                    "country": "UNITED STATES",
                    "product": "STOCKS"
                }
            ],
            "multiCurrency": true,
            "externalId": org_external_id
        }
    ],
    "users": [
        {
            "externalUserId": org_external_id,
            "externalIndividualId": org_external_id,
            "prefix": "elen"
        }
    ],
    "additionalAccounts": null,
    "masterAccountId": null,
    "id": null,
    "inputLanguage": null,
    "translation": null,
    "paperAccount": null
}