import { Application } from "@/lib/clients/application"

const external_id = Math.random().toString(36).substring(2, 12)
export const individual_form: Application = {
    "customer": {
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
                    "dateOfBirth": "2002-01-15",
                    "countryOfBirth": "CRI",
                    "maritalStatus": "M",
                    "numDependents": 0,
                    "residenceAddress": {
                        "street1": "Calle San Miguel",
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
                        "expirationDate": "2026-01-21",
                        "issuingCountry": "CRI",
                        "citizenship": "CRI",
                        "nationalCard": "118490741"
                    },
                    "employmentType": "UNEMPLOYED",
                    "employmentDetails": {
                        "description": null
                    },
                    "externalId": external_id,
                    "taxResidencies": [
                        {
                            "country": "CRI",
                            "tinType": "NonUS_NationalId",
                            "tin": "118490741"
                        }
                    ],
                    "mailingAddress": {
                        "street1": "Calle San Miguel",
                        "country": "CRI",
                        "state": "CR-SJ",
                        "city": "San Jose",
                        "postalCode": "30301"
                    },
                }
            ],
            "financialInformation": [
                {
                    "sourcesOfWealth": [
                        {
                            "sourceType": "SOW-IND-Income",
                            "percentage": 100
                        }
                    ],
                    "investmentExperience": [
                        {
                            "assetClass": "STK",
                            "yearsTrading": 1,
                            "tradesPerYear": 10,
                            "knowledgeLevel": "Limited"
                        }
                    ],
                    "investmentObjectives": [
                        "Growth"
                    ],
                    "netWorth": "7",
                    "liquidNetWorth": "7",
                    "annualNetIncome": "6"
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
            ]
        },
        "type": "INDIVIDUAL",
        "externalId": external_id,
        "prefix": "aaguil",
        "email": "aguilarcarboni@gmail.com",
        "mdStatusNonPro": true,
        "meetAmlStandard": "true",
        "directTradingAccess": true,
        "legalResidenceCountry": "CRI"
    },
    "accounts": [
        {
            "tradingPermissions": [
                {
                    "country": "UNITED STATES",
                    "product": "BONDS"
                }
            ],
            "multiCurrency": true,
            "margin": "Cash",
            "externalId": external_id,
            "baseCurrency": "USD",
            "investmentObjectives": [
                "Growth"
            ]
        }
    ],
    "users": [
        {
            "externalUserId": external_id,
            "externalIndividualId": "cd45acf9-2528-484b-9d9d-65a63c290e40",
            "prefix": "aaguil"
        }
    ],
    "additionalAccounts": null,
    "inputLanguage": null,
    "translation": null,
    "paperAccount": null,
    "masterAccountId": null,
    "id": null
}

export const individual_form_2: Application = {
    "customer": {
        "accountHolder": {
            "accountHolderDetails": [
                {
                    "w8Ben": {
                        "localTaxForms": [],
                        "name": "Sancho Aguilar",
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
                        "first": "Sancho",
                        "last": "Aguilar"
                    },
                    "email": "sancho@gmail.com",
                    "dateOfBirth": "2002-01-15",
                    "countryOfBirth": "CRI",
                    "maritalStatus": "M",
                    "numDependents": 0,
                    "residenceAddress": {
                        "street1": "Calle San Miguel",
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
                        "expirationDate": "2030-01-21",
                        "issuingCountry": "CRI",
                        "citizenship": "CRI",
                        "nationalCard": "118490741"
                    },
                    "employmentType": "UNEMPLOYED",
                    "employmentDetails": {
                        "description": null
                    },
                    "externalId": external_id,
                    "taxResidencies": [
                        {
                            "country": "CRI",
                            "tinType": "NonUS_NationalId",
                            "tin": "118490741"
                        }
                    ],
                    "mailingAddress": {
                        "street1": "Calle San Miguel",
                        "country": "CRI",
                        "state": "CR-SJ",
                        "city": "San Jose",
                        "postalCode": "30301"
                    },
                }
            ],
            "financialInformation": [
                {
                    "sourcesOfWealth": [
                        {
                            "sourceType": "SOW-IND-Income",
                            "percentage": 100
                        }
                    ],
                    "investmentExperience": [
                        {
                            "assetClass": "STK",
                            "yearsTrading": 1,
                            "tradesPerYear": 10,
                            "knowledgeLevel": "Limited"
                        }
                    ],
                    "investmentObjectives": [
                        "Growth"
                    ],
                    "netWorth": "7",
                    "liquidNetWorth": "7",
                    "annualNetIncome": "6"
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
            ]
        },
        "type": "INDIVIDUAL",
        "externalId": external_id,
        "prefix": "aaguil",
        "email": "aguilarcarboni@gmail.com",
        "mdStatusNonPro": true,
        "meetAmlStandard": "true",
        "directTradingAccess": true,
        "legalResidenceCountry": "CRI"
    },
    "accounts": [
        {
            "tradingPermissions": [
                {
                    "country": "UNITED STATES",
                    "product": "BONDS"
                }
            ],
            "multiCurrency": true,
            "margin": "Cash",
            "externalId": external_id,
            "baseCurrency": "USD",
            "investmentObjectives": [
                "Growth"
            ]
        }
    ],
    "users": [
        {
            "externalUserId": external_id,
            "externalIndividualId": "cd45acf9-2528-484b-9d9d-65a63c290e40",
            "prefix": "aaguil"
        }
    ],
    "additionalAccounts": null,
    "inputLanguage": null,
    "translation": null,
    "paperAccount": null,
    "masterAccountId": null,
    "id": null
}

const joint_external_id_1 = Math.random().toString(36).substring(2, 12)
const joint_external_id_2 = Math.random().toString(36).substring(2, 12)

export const joint_form: Application = {
    "customer": {
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
                        "street1": "The Oasis",
                        "street2": "",
                        "country": "CRI",
                        "state": "CR-SJ",
                        "city": "La Union",
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
                        "expirationDate": "2034-07-24",
                        "issuingCountry": "CRI",
                        "citizenship": "CRI",
                        "nationalCard": "118490741"
                    },
                    "employmentType": "UNEMPLOYED",
                    "employmentDetails": {
                        "description": null
                    },
                    "externalId": joint_external_id_1,
                    "taxResidencies": [
                        {
                            "country": "CRI",
                            "tinType": "NonUS_NationalId",
                            "tin": "118490741"
                        }
                    ],
                    "mailingAddress": {
                        "street1": "The Oasis",
                        "street2": "",
                        "country": "CRI",
                        "state": "CR-SJ",
                        "city": "La Union",
                        "postalCode": "30301"
                    }
                }
            ],
            "secondHolderDetails": [
                {
                    "w8Ben": {
                        "localTaxForms": [],
                        "name": "Ana Carboni",
                        "foreignTaxId": "105560956",
                        "tinOrExplanationRequired": true,
                        "part29ACountry": "N/A",
                        "cert": true,
                        "signatureType": "Electronic",
                        "blankForm": true,
                        "taxFormFile": "Form5001.pdf",
                        "electronicFormat": true
                    },
                    "name": {
                        "first": "Ana",
                        "last": "Carboni"
                    },
                    "email": "anavictoriacarboni@gmail.com",
                    "dateOfBirth": "1961-05-20",
                    "countryOfBirth": "CRI",
                    "maritalStatus": "S",
                    "numDependents": 1,
                    "residenceAddress": {
                        "street1": "The Oasis",
                        "country": "CRI",
                        "state": "CR-SJ",
                        "city": "La Union",
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
                        "expirationDate": "2029-05-20",
                        "issuingCountry": "CRI",
                        "citizenship": "CRI",
                        "nationalCard": "105560956"
                    },
                    "employmentType": "UNEMPLOYED",
                    "externalId": joint_external_id_2,
                    "employmentDetails": {
                        "description": null
                    },
                    "taxResidencies": [
                        {
                            "country": "CRI",
                            "tinType": "NonUS_NationalId",
                            "tin": "105560956"
                        }
                    ],
                    "mailingAddress": {
                        "street1": "The Oasis",
                        "country": "CRI",
                        "state": "CR-SJ",
                        "city": "La Union",
                        "postalCode": "30301"
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
            "type": "joint_tenants",
            "financialInformation": [
                {
                    "netWorth": "7",
                    "liquidNetWorth": "6",
                    "annualNetIncome": "7",
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
        },
        "type": "JOINT",
        "externalId": joint_external_id_1,
        "prefix": "aaguil",
        "email": "aguilarcarboni@gmail.com",
        "mdStatusNonPro": true,
        "meetAmlStandard": "true",
        "directTradingAccess": true,
        "legalResidenceCountry": "CRI"
    },
    "accounts": [
        {
            "tradingPermissions": [
                {
                    "country": "UNITED STATES",
                    "product": "BONDS"
                },
                {
                    "country": "CANADA",
                    "product": "BONDS"
                },
                {
                    "country": "UNITED KINGDOM",
                    "product": "BONDS"
                },
                {
                    "country": "GERMANY",
                    "product": "BONDS"
                },
                {
                    "country": "JAPAN",
                    "product": "BONDS"
                },
                {
                    "country": "AUSTRALIA",
                    "product": "BONDS"
                }
            ],
            "multiCurrency": true,
            "margin": "Cash",
            "externalId": joint_external_id_1,
            "baseCurrency": "USD",
            "investmentObjectives": [
                "Growth"
            ]
        }
    ],
    "users": [
        {
            "externalUserId": joint_external_id_1,
            "externalIndividualId": joint_external_id_1,
            "prefix": "aaguil"
        },
        {
            "externalUserId": joint_external_id_2,
            "externalIndividualId": joint_external_id_2,
            "prefix": "acarbo"
        }
    ],
    "additionalAccounts": null,
    "inputLanguage": null,
    "translation": null,
    "paperAccount": null,
    "masterAccountId": null,
    "id": null
}

export const institutional_form: Application = {
    "customer": {
        "organization": {
            "associatedEntities": {
                "associatedIndividuals": [
                    {
                        "w8Ben": {
                            "localTaxForms": [],
                            "name": "Andres Aguilar",
                            "foreignTaxId": "182381283123",
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
                        "dateOfBirth": "2026-02-18",
                        "countryOfBirth": "CRI",
                        "maritalStatus": "S",
                        "numDependents": 0,
                        "residenceAddress": {
                            "street1": "The oasis",
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
                            "expirationDate": "2026-02-11",
                            "issuingCountry": "AGO",
                            "citizenship": "ARG",
                            "nationalCard": "182381283123"
                        },
                        "employmentType": "UNEMPLOYED",
                        "employmentDetails": {
                            "description": null
                        },
                        "externalId": "a88db920-0a12-49f2-a50d-6cad0400260f",
                        "taxResidencies": [
                            {
                                "country": "CRI",
                                "tinType": "NonUS_NationalId",
                                "tin": "182381283123"
                            }
                        ],
                        "mailingAddress": {
                            "street1": "The oasis",
                            "country": "CRI",
                            "state": "CR-SJ",
                            "city": "San Jose",
                            "postalCode": "30301"
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
                    "businessDescription": "Test",
                    "identification": "18124847412",
                    "placeOfBusinessAddress": {
                        "street1": "123 Business Rd",
                        "country": "ATG",
                        "state": "AG-07",
                        "city": "San Jose",
                        "postalCode": "30301"
                    }
                }
            ],
            "accountSupport": {
                "ownersResideUS": false,
                "businessDescription": "Test"
            },
            "financialInformation": [
                {
                    "netWorth": "4",
                    "liquidNetWorth": "4",
                    "annualNetIncome": "4",
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
        },
        "type": "ORG",
        "externalId": "a88db920-0a12-49f2-a50d-6cad0400260f",
        "prefix": "aaguil",
        "email": "aguilarcarboni@gmail.com",
        "mdStatusNonPro": true,
        "meetAmlStandard": "true",
        "directTradingAccess": true,
        "legalResidenceCountry": "CRI"
    },
    "accounts": [
        {
            "tradingPermissions": [
                {
                    "country": "UNITED STATES",
                    "product": "BONDS"
                },
                {
                    "country": "CANADA",
                    "product": "BONDS"
                },
                {
                    "country": "UNITED KINGDOM",
                    "product": "BONDS"
                },
                {
                    "country": "GERMANY",
                    "product": "BONDS"
                },
                {
                    "country": "JAPAN",
                    "product": "BONDS"
                },
                {
                    "country": "AUSTRALIA",
                    "product": "BONDS"
                }
            ],
            "multiCurrency": true,
            "margin": "Cash",
            "externalId": "a88db920-0a12-49f2-a50d-6cad0400260f",
            "baseCurrency": "USD",
            "investmentObjectives": [
                "Growth"
            ]
        }
    ],
    "users": [
        {
            "externalUserId": "a88db920-0a12-49f2-a50d-6cad0400260f",
            "externalIndividualId": "a88db920-0a12-49f2-a50d-6cad0400260f",
            "prefix": "aaguil"
        }
    ],
    "documents": [],
    "additionalAccounts": null,
    "inputLanguage": null,
    "translation": null,
    "paperAccount": null,
    "masterAccountId": null,
    "id": null
}