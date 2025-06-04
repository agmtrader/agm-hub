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
    trading_permission_schema
} from '../schemas/application';

// Inferring TypeScript types from Zod schemas
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

export type IndividualApplicant = z.infer<typeof individual_applicant_schema>;
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


export interface AllForms {
    formDetails: FormDetails[]
}
// Agreement/disclosure form details returned from /applications/forms
export interface FormDetails {
    formNumber: string;
    sha1Checksum: string;
    dateModified: string;
    fileName: string;
    language: string;
    formName: string;
    fileLength: number;
    fileData?: string; // base64 or URL, depending on backend
}

export interface InternalApplication {
    id: string;
    advisor_id: string | null;
    master_account_id: string | null;
    lead_id: string | null;
    application: Application;
}

const user_external_id = Math.random().toString(36).substring(2, 9)
const account_external_id = Math.random().toString(36).substring(2, 9)

const user_name = "Andres"
const user_last_names = "Aguilar Carboni"
const user_email = "test@gmail.com"
const prefix = "tester"

export const application: Application = {
    "customer": {
        "accountHolder": {
            "accountHolderDetails": [
                {
                    "externalId": account_external_id,
                    "name": {
                        "first": user_name,
                        "last": user_last_names
                    },
                    "email": user_email,
                    "residenceAddress": {
                        "country": "CRI",
                        "street1": "The Oasis",
                        "street2": "",
                        "city": "La Union",
                        "state": "CR-C",
                        "postalCode": "30301"
                    },
                    "countryOfBirth": "CRI",
                    "dateOfBirth": "2002-07-24",
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
                    "phones": [
                        {
                            "type": "Mobile",
                            "country": "CRI",
                            "number": "83027366",
                            "verified": true
                        }
                    ],   
                    "sameMailAddress": true,
                    "identification": {
                        "passport": "118490741",
                        "issuingCountry": "CRI"
                    },
                    "employmentType": "EMPLOYED"
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
                            "usedForFunds": true,
                            "description": "Trading"
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
                            "status": true,
                            "details": "Affiliated with Interactive Brokers",
                            "detail": "Affiliated with Interactive Brokers",
                            "externalIndividualId": account_external_id
                        },
                        {
                            "code": "EmployeePubTrade",
                            "status": true,
                            "details": "Employee is not trading publicly",
                            "detail": "Employee is not trading publicly",
                            "externalIndividualId": account_external_id
                        },
                        {
                            "code": "ControlPubTraded",
                            "status": true,
                            "details": "Controlled trading is not allowed",
                            "detail": "Controlled trading is not allowed",
                            "externalIndividualId": account_external_id
                        }
                    ]
                }
            ],
        },
        "externalId": user_external_id,
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
            "externalId": account_external_id,
            "baseCurrency": "USD",
            "multiCurrency": true,
            "margin": "Cash",
        },
    ],
    "users": [
        {
            "externalUserId": user_external_id,
            "externalIndividualId": account_external_id,
            "prefix": prefix
        } 
    ]
}