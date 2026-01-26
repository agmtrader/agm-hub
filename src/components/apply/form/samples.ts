import { Application } from "@/lib/entities/application"

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
                    "netWorth": "8",
                    "liquidNetWorth": "5",
                    "annualNetIncome": "7",
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
