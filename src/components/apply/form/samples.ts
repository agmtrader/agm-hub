import { Application } from "@/lib/entities/application"

// Generate UUIDv4
const external_id = Math.random().toString(36).substring(2, 12)
export const individual_form: Application = {
    "customer": {
        "type": "INDIVIDUAL",
        "externalId": external_id,
        "prefix": "andr",
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
                    "dateOfBirth": "2005-09-15",
                    "countryOfBirth": "CRI",
                    "maritalStatus": "S",
                    "numDependents": 0,
                    "residenceAddress": {
                        "street1": "Calle San Miguel",
                        "street2": null,
                        "country": "CRI",
                        "state": "CR-SJ",
                        "city": "San Jose",
                        "postalCode": "30301"
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
                        "expirationDate": "2030-09-18",
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
                    "mailingAddress": {
                        "street1": "Calle San Miguel",
                        "street2": null,
                        "country": "CRI",
                        "state": "CR-SJ",
                        "city": "San Jose",
                        "postalCode": "30301"
                    },
                    "employmentDetails": null,
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
                            "yearsTrading": 3,
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
            "multiCurrency": true,
            "feesTemplateName": "Default",
            "externalId": external_id,
            "investmentObjectives": [
                "Growth"
            ],
            "baseCurrency": "USD",
            "margin": "Cash",
            "tradingPermissions": [
                {
                    "country": "UNITED STATES",
                    "product": "STOCKS"
                }
            ]
        }
    ],
    "users": [
        {
            "externalUserId": external_id,
            "externalIndividualId": external_id,
            "prefix": "andr"
        }
    ],
    "additionalAccounts": null,
    "masterAccountId": null,
    "id": null,
    "inputLanguage": null,
    "translation": null,
    "paperAccount": null,
    "documents": []
}

const joint_external_id_1 = Math.random().toString(36).substring(2, 12)
const joint_external_id_2 = Math.random().toString(36).substring(2, 12)
export const joint_form: Application = {
    "customer": {
        "type": "JOINT",
        "externalId": "ck1kb864kz",
        "prefix": "ansdf",
        "email": "aguilarcarboni@gmail.com",
        "mdStatusNonPro": true,
        "meetAmlStandard": "true",
        "directTradingAccess": true,
        "legalResidenceCountry": "CRI",
        "jointHolders": {
            "firstHolderDetails": [
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
                        "street1": "Calle San Miguel",
                        "street2": null,
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
                        "expirationDate": "2030-07-25",
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
                    "externalId": "5wtklw7cea",
                    "mailingAddress": {
                        "street1": "Calle San Miguel",
                        "street2": null,
                        "city": "La Union",
                        "state": "CR-C",
                        "postalCode": "30301",
                        "country": "CRI"
                    },
                    "employmentDetails": {
                        "employer": "AGM",
                        "occupation": "Software",
                        "employerBusiness": "Finance",
                        "employerAddress": {
                            "street1": "WeWork",
                            "street2": null,
                            "country": "CRI",
                            "state": "CR-SJ",
                            "city": "Escazu",
                            "postalCode": "10201"
                        }
                    },
                }
            ],
            "secondHolderDetails": [
                {
                    "w8Ben": {
                        "localTaxForms": [],
                        "name": "Carlos Mendez",
                        "foreignTaxId": "118490742",
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
                    "dateOfBirth": "2001-08-22",
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
                            "number": "83027367"
                        }
                    ],
                    "identification": {
                        "expirationDate": "2031-07-16",
                        "issuingCountry": "CRI",
                        "citizenship": "CRI",
                        "passport": "118490742"
                    },
                    "taxResidencies": [
                        {
                            "country": "CRI",
                            "tin": "118490742",
                            "tinType": "NonUS_NationalId"
                        }
                    ],
                    "employmentType": "UNEMPLOYED",
                    "externalId": "dz82znai9q",
                    "mailingAddress": {
                        "street1": "Avenida Escazu",
                        "street2": null,
                        "city": "Escazu",
                        "state": "CR-SJ",
                        "postalCode": "10201",
                        "country": "CRI"
                    },
                    "employmentDetails": null,
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
                    "country": "UNITED STATES",
                    "product": "BONDS"
                }
            ],
            "multiCurrency": true,
            "externalId": "ck1kb864kz",
            "feesTemplateName": "Default"
        }
    ],
    "users": [
        {
            "externalUserId": "ck1kb864kz",
            "externalIndividualId": "ck1kb864kz",
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

export const test_form:Application = {
    "accounts": [
        {
            "baseCurrency": "USD",
            "externalId": "7c55fc38-fa11-4bd4-b4eb-30bcb8438538",
            "feesTemplateName": "Default",
            "investmentObjectives": [
                "Growth"
            ],
            "margin": "Cash",
            "multiCurrency": true,
            "tradingPermissions": []
        }
    ],
    "additionalAccounts": null,
    "customer": {
        "directTradingAccess": true,
        "email": "miguelherran@gmail.com",
        "externalId": "7c55fc38-fa11-4bd4-b4eb-30bcb8438538",
        "jointHolders": {
            "financialInformation": [
                {
                    "annualNetIncome": 100000,
                    "investmentExperience": [],
                    "investmentObjectives": [
                        "Growth"
                    ],
                    "liquidNetWorth": 100000,
                    "netWorth": 500000,
                    "sourcesOfWealth": [
                        {
                            "sourceType": "SOW-IND-Income"
                        }
                    ]
                }
            ],
            "firstHolderDetails": [
                {
                    "countryOfBirth": "COL",
                    "dateOfBirth": "1988-05-03",
                    "email": "miguelherran@gmail.com",
                    "employmentDetails": {
                        "employer": "Walmart",
                        "employerAddress": {
                            "city": "Ciudad de Mexico",
                            "country": "MEX",
                            "postalCode": "11220",
                            "state": "MX-CMX",
                            "street1": "Rodolfo gaona 647"
                        },
                        "employerBusiness": "Retail",
                        "occupation": "Subdirector "
                    },
                    "employmentType": "EMPLOYED",
                    "externalId": "7c55fc38-fa11-4bd4-b4eb-30bcb8438538",
                    "identification": {
                        "citizenship": "COL",
                        "expirationDate": "2031-05-19",
                        "issuingCountry": "COL",
                        "passport": "AX171100"
                    },
                    "mailingAddress": null,
                    "maritalStatus": "D",
                    "name": {
                        "first": "Miguel",
                        "last": "Herran"
                    },
                    "numDependents": 2,
                    "phones": [
                        {
                            "country": "MEX",
                            "number": "5572276345",
                            "type": "Mobile"
                        }
                    ],
                    "residenceAddress": {
                        "city": "Ciudad de Mexico",
                        "country": "MEX",
                        "postalCode": "11520",
                        "state": "MX-CMX",
                        "street1": "Lago Filt 7"
                    },
                    "sameMailAddress": true,
                    "taxResidencies": [
                        {
                            "country": "MEX",
                            "tin": "HETM8805037E0",
                            "tinType": "NonUS_NationalId"
                        }
                    ],
                    "w8Ben": {
                        "blankForm": true,
                        "cert": true,
                        "electronicFormat": true,
                        "foreignTaxId": "HETM8805037E0",
                        "localTaxForms": [],
                        "name": "Miguel Herran",
                        "part29ACountry": "N/A",
                        "signatureType": "Electronic",
                        "taxFormFile": "Form5001.pdf",
                        "tinOrExplanationRequired": true
                    }
                }
            ],
            "regulatoryInformation": [
                {
                    "regulatoryDetails": [
                        {
                            "code": "AFFILIATION",
                            "details": "Affiliated with Interactive Brokers",
                            "status": false
                        },
                        {
                            "code": "EmployeePubTrade",
                            "details": "WALMEX",
                            "status": true
                        },
                        {
                            "code": "ControlPubTraded",
                            "details": "Controlled trading is not allowed",
                            "status": false
                        }
                    ]
                }
            ],
            "secondHolderDetails": [
                {
                    "countryOfBirth": "MEX",
                    "dateOfBirth": "1992-07-15",
                    "email": "mpg_301@hotmail.com",
                    "employmentDetails": {
                        "employer": "Viva Aerobus",
                        "employerAddress": {
                            "city": "Ciudad de Mexico",
                            "country": "MEX",
                            "postalCode": "60600",
                            "state": "MX-CMX",
                            "street1": "varsovia 36"
                        },
                        "employerBusiness": "Aerolinea",
                        "occupation": "Head de Marketing"
                    },
                    "employmentType": "EMPLOYED",
                    "externalId": "53660a83-6296-4c3a-bbf6-a6c6dc93e1cc",
                    "identification": {
                        "citizenship": "MEX",
                        "expirationDate": "2033-07-20",
                        "issuingCountry": "MEX",
                        "passport": "N09348100"
                    },
                    "mailingAddress": null,
                    "maritalStatus": "S",
                    "name": {
                        "first": "Montserrat",
                        "last": "Perez"
                    },
                    "numDependents": 0,
                    "phones": [
                        {
                            "country": "MEX",
                            "number": "6561023150",
                            "type": "Mobile"
                        }
                    ],
                    "residenceAddress": {
                        "city": "Ciudad de Mexico",
                        "country": "MEX",
                        "postalCode": "11520",
                        "state": "MX-CMX",
                        "street1": "Lago Filt 7"
                    },
                    "sameMailAddress": true,
                    "taxResidencies": [
                        {
                            "country": "MEX",
                            "tin": "PEGM920715GH7",
                            "tinType": "NonUS_NationalId"
                        }
                    ],
                    "w8Ben": {
                        "blankForm": true,
                        "cert": true,
                        "electronicFormat": true,
                        "foreignTaxId": "PEGM920715GH7",
                        "localTaxForms": [],
                        "name": "Montserrat Perez",
                        "part29ACountry": "N/A",
                        "signatureType": "Electronic",
                        "taxFormFile": "Form5001.pdf",
                        "tinOrExplanationRequired": true
                    }
                }
            ],
            "type": "joint_tenants"
        },
        "legalResidenceCountry": "MEX",
        "mdStatusNonPro": true,
        "meetAmlStandard": "true",
        "prefix": "Migueh",
        "type": "JOINT"
    },
    "id": null,
    "inputLanguage": null,
    "masterAccountId": null,
    "paperAccount": null,
    "translation": null,
    "users": [
        {
            "externalIndividualId": "7c55fc38-fa11-4bd4-b4eb-30bcb8438538",
            "externalUserId": "7c55fc38-fa11-4bd4-b4eb-30bcb8438538",
            "prefix": "Migueh"
        },
        {
            "externalIndividualId": "53660a83-6296-4c3a-bbf6-a6c6dc93e1cc",
            "externalUserId": "53660a83-6296-4c3a-bbf6-a6c6dc93e1cc",
            "prefix": "Mpg_301"
        }
    ]
}