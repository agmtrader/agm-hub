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