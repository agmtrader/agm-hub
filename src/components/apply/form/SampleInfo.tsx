import { Application } from "@/lib/entities/application"

// Generate UUIDv4
const external_id = Math.random().toString(36).substring(2, 12)
export const individual_form:Application = {
    "customer": {
        "type": "INDIVIDUAL",
        "externalId": external_id,
        "prefix": "elen",
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
                    "dateOfBirth": "2002-07-12",
                    "countryOfBirth": "CRI",
                    "maritalStatus": "S",
                    "numDependents": 0,
                    "residenceAddress": {
                        "street1": "Calle San Miguel",
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
                    "identification": {
                        "expirationDate": "2031-07-17",
                        "issuingCountry": "CRI",
                        "citizenship": "CRI",
                        "nationalCard": "118490741"
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
                        "occupation": "Software Engineer",
                        "employerBusiness": "Finance",
                        "employerAddress": {
                            "street1": "Hype Way",
                            "street2": null,
                            "city": "San Jose",
                            "state": "CR-SJ",
                            "postalCode": "10301",
                            "country": "CRI"
                        }
                    },
                    "externalId": external_id
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
export const joint_form:Application = {
    "customer": {
        "jointHolders": {
            "firstHolderDetails": [
                {
                    "w8Ben": {
                        "localTaxForms": [],
                        "name": "Andres Aguilar",
                        "foreignTaxId": "221334567",
                        "tinOrExplanationRequired": true,
                        "part29ACountry": "N/A",
                        "cert": true,
                        "signatureType": "Electronic",
                        "blankForm": true,
                        "taxFormFile": "Form5001.pdf",
                        "electronicFormat": true
                    },
                    "externalId": joint_external_id_1,
                    "email": `aguilarcarboni@gmail.com`,
                    "name": {
                        "first": "Andres",
                        "last": "Aguilar",
                        "salutation": "Mr.",
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
                    "w8Ben": {
                        "localTaxForms": [],
                        "name": "Ana Carboni",
                        "foreignTaxId": "334567890",
                        "tinOrExplanationRequired": true,
                        "part29ACountry": "N/A",
                        "cert": true,
                        "signatureType": "Electronic",
                        "blankForm": true,
                        "taxFormFile": "Form5001.pdf",
                        "electronicFormat": true
                    },
                    "externalId": joint_external_id_2,
                    "email": `anavictoriacarboni@gmail.com`,
                    "name": {
                        "first": "Ana",
                        "last": "Carboni",
                        "salutation": "Ms.",
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
        "prefix": 'joints',
        "email": `aguilarcarboni@gmail.com`, // Primary holder's email for customer
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
            "prefix": 'joints'
        },
        {
            "externalUserId": joint_external_id_2,
            "externalIndividualId": joint_external_id_2,
            "prefix": 'joints'
        }
    ],
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