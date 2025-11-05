import { Application } from "@/lib/entities/application"

const joint_external_id_1 = Math.random().toString(36).substring(2, 12)
const joint_external_id_2 = Math.random().toString(36).substring(2, 12)

export const test_form:Application = {
    "accounts": [
        {
            "baseCurrency": "USD",
            "externalId": joint_external_id_1,
            "feesTemplateName": "Default",
            "investmentObjectives": [
                "Growth",
                "Income"
            ],
            "margin": "Margin",
            "multiCurrency": true,
            "tradingPermissions": [
                {
                    "country": "UNITED STATES",
                    "product": "BONDS"
                }
            ]
        }
    ],
    "additionalAccounts": null,
    "customer": {
        "directTradingAccess": true,
        "email": "Danielaog210@gmail.com",
        "externalId": joint_external_id_1,
        "jointHolders": {
            "financialInformation": [
                {
                    "annualNetIncome": 60000,
                    "investmentExperience": [
                        {
                            "assetClass": "STK",
                            "knowledgeLevel": "Good",
                            "tradesPerYear": 25,
                            "yearsTrading": 3
                        }
                    ],
                    "investmentObjectives": [
                        "Growth",
                        "Income"
                    ],
                    "liquidNetWorth": 75000,
                    "netWorth": 250000,
                    "sourcesOfWealth": [
                        {
                            "percentage": 100,
                            "sourceType": "SOW-IND-Income"
                        }
                    ]
                }
            ],
            "firstHolderDetails": [
                {
                    "countryOfBirth": "CRI",
                    "dateOfBirth": "1993-03-27",
                    "email": "Danielaog210@gmail.com",
                    "employmentDetails": {
                        "employer": "Alcon",
                        "employerAddress": {
                            "city": "Panama",
                            "country": "PAN",
                            "postalCode": "64154",
                            "state": "Panama City",
                            "street1": "Av Paseo del Mar, Panama, Provincia de Panama,",
                            "street2": null
                        },
                        "employerBusiness": "Healthcare",
                        "occupation": "Analyst"
                    },
                    "employmentType": "EMPLOYED",
                    "externalId": joint_external_id_1,
                    "identification": {
                        "citizenship": "MEX",
                        "expirationDate": "2030-09-17",
                        "issuingCountry": "MEX",
                        "passport": "00GD930327MMCRNN00"
                    },
                    "mailingAddress": null,
                    "maritalStatus": "S",
                    "name": {
                        "first": "Daniela",
                        "last": "Orozco Granados"
                    },
                    "numDependents": 0,
                    "phones": [
                        {
                            "country": "MEX",
                            "number": "5540632886",
                            "type": "Mobile"
                        }
                    ],
                    "residenceAddress": {
                        "city": "Costa del Este",
                        "country": "PAN",
                        "postalCode": "64154",
                        "state": "Panama City",
                        "street1": "PH Top Tower 13 1301 COSTA DEL ESTE JUAN DIAZ PANAMA",
                        "street2": null
                    },
                    "sameMailAddress": true,
                    "taxResidencies": [
                        {
                            "country": "MEX",
                            "tin": "00GD930327MMCRNN00",
                            "tinType": "EIN"
                        }
                    ],
                    "w8Ben": {
                        "blankForm": true,
                        "cert": true,
                        "electronicFormat": true,
                        "foreignTaxId": "00GD930327MMCRNN00",
                        "localTaxForms": [],
                        "name": "Daniela Orozco Granados",
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
                            "details": "Employee is not trading publicly",
                            "status": false
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
                    "dateOfBirth": "1997-07-29",
                    "email": "Hannahabutbul@gmail.com",
                    "employmentDetails": {
                        "employer": "Ximena Orozco Granados",
                        "employerAddress": {
                            "city": "Panama",
                            "country": "PAN",
                            "postalCode": "64154",
                            "state": "Panama City",
                            "street1": "PH Top Tower 13 1301 COSTA DEL ESTE JUAN DIAZ PANAMA",
                            "street2": null
                        },
                        "employerBusiness": "Content Creation",
                        "occupation": "Content Creator"
                    },
                    "employmentType": "SELF_EMPLOYED",
                    "externalId": joint_external_id_2,
                    "identification": {
                        "citizenship": "MEX",
                        "expirationDate": "2028-05-30",
                        "issuingCountry": "MEX",
                        "passport": "OOGX970729MDFRRM09"
                    },
                    "mailingAddress": {
                        "city": null,
                        "country": null,
                        "postalCode": null,
                        "state": null,
                        "street1": null
                    },
                    "maritalStatus": "S",
                    "name": {
                        "first": "Ximena",
                        "last": "Orozco Granados"
                    },
                    "numDependents": 0,
                    "phones": [
                        {
                            "country": "MEX",
                            "number": "5540632886",
                            "type": "Mobile"
                        }
                    ],
                    "residenceAddress": {
                        "city": "Panama",
                        "country": "PAN",
                        "postalCode": "64154",
                        "state": "Panama City",
                        "street1": "PH Top Tower 13 1301 COSTA DEL ESTE JUAN DIAZ PANAMA",
                        "street2": null
                    },
                    "sameMailAddress": true,
                    "taxResidencies": [
                        {
                            "country": "MEX",
                            "tin": "OOGX970729MDFRRM09",
                            "tinType": "NonUS_NationalId"
                        }
                    ],
                    "w8Ben": {
                        "blankForm": true,
                        "cert": true,
                        "electronicFormat": true,
                        "foreignTaxId": "OOGX970729MDFRRM09",
                        "localTaxForms": [],
                        "name": "Ximena Orozco Granados",
                        "part29ACountry": "N/A",
                        "signatureType": "Electronic",
                        "taxFormFile": "Form5001.pdf",
                        "tinOrExplanationRequired": true
                    }
                }
            ],
            "type": "joint_tenants"
        },
        "legalResidenceCountry": "PAN",
        "mdStatusNonPro": true,
        "meetAmlStandard": "true",
        "prefix": "dorz31",
        "type": "JOINT"
    },
    "documents": [
    ],
    "id": null,
    "inputLanguage": null,
    "masterAccountId": null,
    "paperAccount": null,
    "translation": null,
    "users": [
        {
            "externalIndividualId": joint_external_id_1,
            "externalUserId": joint_external_id_1,
            "prefix": "dorz31"
        },
        {
            "externalIndividualId": joint_external_id_2,
            "externalUserId": joint_external_id_2,
            "prefix": "dorz31"
        }
    ]
}