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
                        "name": "Andy Sanchez",
                        "foreignTaxId": "208600382",
                        "tinOrExplanationRequired": true,
                        "part29ACountry": "N/A",
                        "cert": true,
                        "signatureType": "Electronic",
                        "blankForm": true,
                        "taxFormFile": "Form5001.pdf",
                        "electronicFormat": true
                    },
                    "name": {
                        "first": "Andy",
                        "last": "Sanchez"
                    },
                    "email": "andysanc42@gmail.com",
                    "dateOfBirth": "2004-12-08",
                    "countryOfBirth": "CRI",
                    "maritalStatus": "S",
                    "numDependents": 1,
                    "residenceAddress": {
                        "street1": "Los Lirios",
                        "country": "CRI",
                        "state": "CR-Al",
                        "city": "San Ramon",
                        "postalCode": "20201"
                    },
                    "sameMailAddress": true,
                    "phones": [
                        {
                            "type": "Mobile",
                            "country": "CRI",
                            "number": "83291475"
                        }
                    ],
                    "identification": {
                        "expirationDate": "2032-12-08",
                        "issuingCountry": "CRI",
                        "citizenship": "CRI",
                        "nationalCard": "208600382"
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
                            "tin": "208600382"
                        }
                    ],
                    "mailingAddress": {
                        "street1": "Los Lirios",
                        "country": "CRI",
                        "state": "CR-Al",
                        "city": "San Ramon",
                        "postalCode": "20201"
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
                            "expirationDate": "2033-02-08",
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
                    },
                    {
                        "w8Ben": {
                            "localTaxForms": [],
                            "name": "Andy Sanchez",
                            "foreignTaxId": "208600382",
                            "tinOrExplanationRequired": true,
                            "part29ACountry": "N/A",
                            "cert": true,
                            "signatureType": "Electronic",
                            "blankForm": true,
                            "taxFormFile": "Form5001.pdf",
                            "electronicFormat": true
                        },
                        "name": {
                            "first": "Andy",
                            "last": "Sanchez"
                        },
                        "email": "andysanc42@gmail.com",
                        "dateOfBirth": "2004-12-08",
                        "countryOfBirth": "CRI",
                        "maritalStatus": "S",
                        "numDependents": 0,
                        "residenceAddress": {
                            "street1": "San Juan",
                            "street2": "",
                            "country": "CRI",
                            "state": "CR-A",
                            "city": "San Ramon",
                            "postalCode": "20201"
                        },
                        "sameMailAddress": true,
                        "phones": [
                            {
                                "type": "Mobile",
                                "country": "CRI",
                                "number": "83291475"
                            }
                        ],
                        "identification": {
                            "expirationDate": "2032-12-08",
                            "issuingCountry": "CRI",
                            "citizenship": "CRI",
                            "nationalCard": "208600382"
                        },
                        "employmentType": "UNEMPLOYED",
                        "employmentDetails": {
                            "description": null
                        },
                        "externalId": "5707e0cf-e307-4ffe-a723-5c60ea81cf5f",
                        "taxResidencies": [
                            {
                                "country": "CRI",
                                "tinType": "NonUS_NationalId",
                                "tin": "208600382"
                            }
                        ],
                        "mailingAddress": null
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
            ],
            "beneficialOwnership": {
                "hasBeneficialOwners": true,
                "beneficialOwners": [
                    {
                        "fullName": "Andy Sanchez",
                        "ownershipPercentage": 25,
                        "relationship": "test"
                    },
                    {
                        "fullName": "Andres Aguilar",
                        "ownershipPercentage": 25,
                        "relationship": "test"
                    }
                ],
                "intermediateEntities": [],
                "trustees": []
            }
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

export const joaquin:Application = {
  "id": null,
  "users": [
    {
      "prefix": "jarias",
      "externalUserId": "f1bb55b7-6dca-4b9d-bbc5-dfbd62f09e93",
      "externalIndividualId": "f1bb55b7-6dca-4b9d-bbc5-dfbd62f09e93"
    }
  ],
  "accounts": [
    {
      "margin": "Cash",
      "externalId": "f1bb55b7-6dca-4b9d-bbc5-dfbd62f09e93",
      "baseCurrency": "USD",
      "capabilities": [
        "CLP"
      ],
      "multiCurrency": true,
      "tradingPermissions": [
        {
          "country": "UNITED STATES",
          "product": "BONDS"
        },
        {
          "country": "UNITED STATES",
          "product": "MUTUAL FUNDS"
        },
        {
          "country": "CANADA",
          "product": "MUTUAL FUNDS"
        },
        {
          "country": "UNITED KINGDOM",
          "product": "MUTUAL FUNDS"
        },
        {
          "country": "GERMANY",
          "product": "MUTUAL FUNDS"
        },
        {
          "country": "JAPAN",
          "product": "MUTUAL FUNDS"
        },
        {
          "country": "AUSTRALIA",
          "product": "MUTUAL FUNDS"
        },
        {
          "country": "UNITED STATES",
          "product": "OPTIONS"
        },
        {
          "country": "CANADA",
          "product": "OPTIONS"
        },
        {
          "country": "UNITED KINGDOM",
          "product": "OPTIONS"
        },
        {
          "country": "GERMANY",
          "product": "OPTIONS"
        },
        {
          "country": "JAPAN",
          "product": "OPTIONS"
        },
        {
          "country": "AUSTRALIA",
          "product": "OPTIONS"
        },
        {
          "country": "UNITED STATES",
          "product": "STOCKS"
        },
        {
          "country": "CANADA",
          "product": "STOCKS"
        },
        {
          "country": "UNITED KINGDOM",
          "product": "STOCKS"
        },
        {
          "country": "GERMANY",
          "product": "STOCKS"
        },
        {
          "country": "JAPAN",
          "product": "STOCKS"
        },
        {
          "country": "AUSTRALIA",
          "product": "STOCKS"
        },
        {
          "country": "UNITED STATES",
          "product": "FUTURES"
        },
        {
          "country": "CANADA",
          "product": "FUTURES"
        },
        {
          "country": "UNITED KINGDOM",
          "product": "FUTURES"
        },
        {
          "country": "GERMANY",
          "product": "FUTURES"
        },
        {
          "country": "JAPAN",
          "product": "FUTURES"
        },
        {
          "country": "AUSTRALIA",
          "product": "FUTURES"
        }
      ],
      "investmentObjectives": [
        "Income",
        "Growth"
      ]
    }
  ],
  "customer": {
    "type": "INDIVIDUAL",
    "email": "yoakkin@gmail.com",
    "prefix": "jarias",
    "externalId": "f1bb55b7-6dca-4b9d-bbc5-dfbd62f09e93",
    "accountHolder": {
      "accountHolderDetails": [
        {
          "name": {
            "last": "Arias Robles",
            "first": "Joaquin Alberto"
          },
          "email": "yoakkin@gmail.com",
          "w8Ben": {
            "cert": true,
            "name": "Joaquin Alberto Arias Robles",
            "blankForm": true,
            "taxFormFile": "Form5001.pdf",
            "foreignTaxId": "109900839",
            "localTaxForms": [],
            "signatureType": "Electronic",
            "part29ACountry": "N/A",
            "electronicFormat": true,
            "tinOrExplanationRequired": true
          },
          "phones": [
            {
              "type": "Mobile",
              "number": "83684956",
              "country": "CRI"
            }
          ],
          "externalId": "f1bb55b7-6dca-4b9d-bbc5-dfbd62f09e93",
          "dateOfBirth": "1978-01-12",
          "maritalStatus": "D",
          "numDependents": 1,
          "countryOfBirth": "CRI",
          "employmentType": "EMPLOYED",
          "identification": {
            "citizenship": "CRI",
            "nationalCard": "109900839",
            "expirationDate": "2034-02-06",
            "issuingCountry": "CRI"
          },
          "mailingAddress": null,
          "taxResidencies": [
            {
              "tin": "109900839",
              "country": "CRI",
              "tinType": "NonUS_NationalId"
            }
          ],
          "sameMailAddress": true,
          "residenceAddress": {
            "city": "Escazu",
            "state": "CR-SJ",
            "country": "CRI",
            "street1": "San Antonio de Escazu, Barrio el Carmen, del super Aguimar 50m",
            "street2": "Casa a Mano Derecha",
            "postalCode": "10202"
          },
          "employmentDetails": {
            "employer": "Banco Nacional de Costa Rica",
            "occupation": "IT Engineer",
            "description": null,
            "employerAddress": {
              "city": "San Jose",
              "state": "CR-SJ",
              "country": "CRI",
              "street1": "San Jose Centro, Avenidas 1 y 3, Calles 2 y 4",
              "street2": null,
              "postalCode": "10101"
            },
            "employerBusiness": "Finance/Broker Dealer/Bank"
          }
        }
      ],
      "financialInformation": [
        {
          "netWorth": "6",
          "liquidNetWorth": "5",
          "annualNetIncome": "5",
          "sourcesOfWealth": [
            {
              "percentage": 100,
              "sourceType": "SOW-IND-Income"
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
            "Income",
            "Growth"
          ]
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
    "mdStatusNonPro": true,
    "meetAmlStandard": "true",
    "directTradingAccess": true,
    "legalResidenceCountry": "CRI"
  },
  "documents": [],
  "translation": null,
  "paperAccount": null,
  "inputLanguage": null,
  "masterAccountId": null,
  "additionalAccounts": null
}
