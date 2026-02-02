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
import { Base } from './base';
import { Map } from '../public/types';

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

export type InternalApplicationPayload = {
    advisor_code: string | null;
    master_account: string | null;
    application: Application | null;
    date_sent_to_ibkr: string | null;
    status: string | null;
    contact_id: string | null;
    security_questions: Map | null;
    estimated_deposit?: number | null;
    risk_profile_id: string | null;
}

export type InternalApplication = InternalApplicationPayload & Base

export const countries = [
    { label: "Afghanistan", value: "AFG" },
    { label: "Albania", value: "ALB" },
    { label: "Algeria", value: "DZA" },
    { label: "Andorra", value: "AND" },
    { label: "Angola", value: "AGO" },
    { label: "Antigua and Barbuda", value: "ATG" },
    { label: "Argentina", value: "ARG" },
    { label: "Armenia", value: "ARM" },
    { label: "Australia", value: "AUS" },
    { label: "Austria", value: "AUT" },
    { label: "Azerbaijan", value: "AZE" },
    { label: "Bahamas", value: "BHS" },
    { label: "Bahrain", value: "BHR" },
    { label: "Bangladesh", value: "BGD" },
    { label: "Barbados", value: "BRB" },
    { label: "Belarus", value: "BLR" },
    { label: "Belgium", value: "BEL" },
    { label: "Belize", value: "BLZ" },
    { label: "Benin", value: "BEN" },
    { label: "Bhutan", value: "BTN" },
    { label: "Bolivia", value: "BOL" },
    { label: "Bosnia and Herzegovina", value: "BIH" },
    { label: "Botswana", value: "BWA" },
    { label: "Brazil", value: "BRA" },
    { label: "Brunei", value: "BRN" },
    { label: "Bulgaria", value: "BGR" },
    { label: "Burkina Faso", value: "BFA" },
    { label: "Burundi", value: "BDI" },
    { label: "Cabo Verde", value: "CPV" },
    { label: "Cambodia", value: "KHM" },
    { label: "Cameroon", value: "CMR" },
    { label: "Canada", value: "CAN" },
    { label: "Central African Republic", value: "CAF" },
    { label: "Chad", value: "TCD" },
    { label: "Chile", value: "CHL" },
    { label: "China", value: "CHN" },
    { label: "Colombia", value: "COL" },
    { label: "Comoros", value: "COM" },
    { label: "Congo, Democratic Republic of the", value: "COD" },
    { label: "Congo, Republic of the", value: "COG" },
    { label: "Costa Rica", value: "CRI" },
    { label: "Croatia", value: "HRV" },
    { label: "Cuba", value: "CUB" },
    { label: "Cyprus", value: "CYP" },
    { label: "Czech Republic", value: "CZE" },
    { label: "Denmark", value: "DNK" },
    { label: "Djibouti", value: "DJI" },
    { label: "Dominica", value: "DMA" },
    { label: "Dominican Republic", value: "DOM" },
    { label: "Ecuador", value: "ECU" },
    { label: "Egypt", value: "EGY" },
    { label: "El Salvador", value: "SLV" },
    { label: "Equatorial Guinea", value: "GNQ" },
    { label: "Eritrea", value: "ERI" },
    { label: "Estonia", value: "EST" },
    { label: "Eswatini", value: "SWZ" },
    { label: "Ethiopia", value: "ETH" },
    { label: "Fiji", value: "FJI" },
    { label: "Finland", value: "FIN" },
    { label: "France", value: "FRA" },
    { label: "Gabon", value: "GAB" },
    { label: "Gambia", value: "GMB" },
    { label: "Georgia", value: "GEO" },
    { label: "Germany", value: "DEU" },
    { label: "Ghana", value: "GHA" },
    { label: "Greece", value: "GRC" },
    { label: "Grenada", value: "GRD" },
    { label: "Guatemala", value: "GTM" },
    { label: "Guinea", value: "GIN" },
    { label: "Guinea-Bissau", value: "GNB" },
    { label: "Guyana", value: "GUY" },
    { label: "Haiti", value: "HTI" },
    { label: "Honduras", value: "HND" },
    { label: "Hungary", value: "HUN" },
    { label: "Iceland", value: "ISL" },
    { label: "India", value: "IND" },
    { label: "Indonesia", value: "IDN" },
    { label: "Iran", value: "IRN" },
    { label: "Iraq", value: "IRQ" },
    { label: "Ireland", value: "IRL" },
    { label: "Israel", value: "ISR" },
    { label: "Italy", value: "ITA" },
    { label: "Jamaica", value: "JAM" },
    { label: "Japan", value: "JPN" },
    { label: "Jordan", value: "JOR" },
    { label: "Kazakhstan", value: "KAZ" },
    { label: "Kenya", value: "KEN" },
    { label: "Kiribati", value: "KIR" },
    { label: "Korea, North", value: "PRK" },
    { label: "Korea, South", value: "KOR" },
    { label: "Kosovo", value: "XKX" },
    { label: "Kuwait", value: "KWT" },
    { label: "Kyrgyzstan", value: "KGZ" },
    { label: "Laos", value: "LAO" },
    { label: "Latvia", value: "LVA" },
    { label: "Lebanon", value: "LBN" },
    { label: "Lesotho", value: "LSO" },
    { label: "Liberia", value: "LBR" },
    { label: "Libya", value: "LBY" },
    { label: "Liechtenstein", value: "LIE" },
    { label: "Lithuania", value: "LTU" },
    { label: "Luxembourg", value: "LUX" },
    { label: "Madagascar", value: "MDG" },
    { label: "Malawi", value: "MWI" },
    { label: "Malaysia", value: "MYS" },
    { label: "Maldives", value: "MDV" },
    { label: "Mali", value: "MLI" },
    { label: "Malta", value: "MLT" },
    { label: "Marshall Islands", value: "MHL" },
    { label: "Mauritania", value: "MRT" },
    { label: "Mauritius", value: "MUS" },
    { label: "Mexico", value: "MEX" },
    { label: "Micronesia", value: "FSM" },
    { label: "Moldova", value: "MDA" },
    { label: "Monaco", value: "MCO" },
    { label: "Mongolia", value: "MNG" },
    { label: "Montenegro", value: "MNE" },
    { label: "Morocco", value: "MAR" },
    { label: "Mozambique", value: "MOZ" },
    { label: "Myanmar", value: "MMR" },
    { label: "Namibia", value: "NAM" },
    { label: "Nauru", value: "NRU" },
    { label: "Nepal", value: "NPL" },
    { label: "Netherlands", value: "NLD" },
    { label: "New Zealand", value: "NZL" },
    { label: "Nicaragua", value: "NIC" },
    { label: "Niger", value: "NER" },
    { label: "Nigeria", value: "NGA" },
    { label: "North Macedonia", value: "MKD" },
    { label: "Norway", value: "NOR" },
    { label: "Oman", value: "OMN" },
    { label: "Pakistan", value: "PAK" },
    { label: "Palau", value: "PLW" },
    { label: "Panama", value: "PAN" },
    { label: "Papua New Guinea", value: "PNG" },
    { label: "Paraguay", value: "PRY" },
    { label: "Peru", value: "PER" },
    { label: "Philippines", value: "PHL" },
    { label: "Poland", value: "POL" },
    { label: "Portugal", value: "PRT" },
    { label: "Qatar", value: "QAT" },
    { label: "Romania", value: "ROU" },
    { label: "Russia", value: "RUS" },
    { label: "Rwanda", value: "RWA" },
    { label: "Saint Kitts and Nevis", value: "KNA" },
    { label: "Saint Lucia", value: "LCA" },
    { label: "Saint Vincent and the Grenadines", value: "VCT" },
    { label: "Samoa", value: "WSM" },
    { label: "San Marino", value: "SMR" },
    { label: "Sao Tome and Principe", value: "STP" },
    { label: "Saudi Arabia", value: "SAU" },
    { label: "Senegal", value: "SEN" },
    { label: "Serbia", value: "SRB" },
    { label: "Seychelles", value: "SYC" },
    { label: "Sierra Leone", value: "SLE" },
    { label: "Singapore", value: "SGP" },
    { label: "Slovakia", value: "SVK" },
    { label: "Slovenia", value: "SVN" },
    { label: "Solomon Islands", value: "SLB" },
    { label: "Somalia", value: "SOM" },
    { label: "South Africa", value: "ZAF" },
    { label: "South Sudan", value: "SSD" },
    { label: "Spain", value: "ESP" },
    { label: "Sri Lanka", value: "LKA" },
    { label: "Sudan", value: "SDN" },
    { label: "Suriname", value: "SUR" },
    { label: "Sweden", value: "SWE" },
    { label: "Switzerland", value: "CHE" },
    { label: "Syria", value: "SYR" },
    { label: "Taiwan", value: "TWN" },
    { label: "Tajikistan", value: "TJK" },
    { label: "Tanzania", value: "TZA" },
    { label: "Thailand", value: "THA" },
    { label: "Timor-Leste", value: "TLS" },
    { label: "Togo", value: "TGO" },
    { label: "Tonga", value: "TON" },
    { label: "Trinidad and Tobago", value: "TTO" },
    { label: "Tunisia", value: "TUN" },
    { label: "Turkey", value: "TUR" },
    { label: "Turkmenistan", value: "TKM" },
    { label: "Tuvalu", value: "TUV" },
    { label: "Uganda", value: "UGA" },
    { label: "Ukraine", value: "UKR" },
    { label: "United Arab Emirates", value: "ARE" },
    { label: "United Kingdom", value: "GBR" },
    { label: "United States", value: "USA" },
    { label: "Uruguay", value: "URY" },
    { label: "Uzbekistan", value: "UZB" },
    { label: "Vanuatu", value: "VUT" },
    { label: "Vatican City", value: "VAT" },
    { label: "Venezuela", value: "VEN" },
    { label: "Vietnam", value: "VNM" },
    { label: "Yemen", value: "YEM" },
    { label: "Zambia", value: "ZMB" },
    { label: "Zimbabwe", value: "ZWE" },
]

export const currencies = [
  { label: "USD", value: "USD" },
  { label: "AED", value: "AED" },
  { label: "AUD", value: "AUD" },
  { label: "CAD", value: "CAD" },
  { label: "CHF", value: "CHF" },
  { label: "CNH", value: "CNH" },
  { label: "CZK", value: "CZK" },
  { label: "DKK", value: "DKK" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  { label: "HKD", value: "HKD" },
  { label: "HUF", value: "HUF" },
  { label: "ILS", value: "ILS" },
  { label: "JPY", value: "JPY" },
  { label: "MXN", value: "MXN" },
  { label: "NOK", value: "NOK" },
  { label: "NZD", value: "NZD" },
  { label: "PLN", value: "PLN" },
  { label: "SAR", value: "SAR" },
  { label: "SEK", value: "SEK" },
  { label: "SGD", value: "SGD" },
  { label: "TRY", value: "TRY" },
  { label: "ZAR", value: "ZAR" },
  { label: "KRW", value: "KRW" },
]

export const knowledge_levels = [
  { label: "None", value: "None" },
  { label: "Limited", value: "Limited" },
  { label: "Good", value: "Good" },
  { label: "Extensive", value: "Extensive" },
]

export const asset_classes = [
  { label: "Bonds", value: "BOND" },
  { label: "ETFs", value: "FUND" },
  { label: "Stocks", value: "STK" },
  { label: "Options", value: "OPT" },
  { label: "Futures", value: "FUT" },
]

export const marital_status = (t: (key: string) => string) => [
    { label: t('apply.account.account_holder_info.single'), value: "S" },
    { label: t('apply.account.account_holder_info.married'), value: "M" },
    { label: t('apply.account.account_holder_info.divorced'), value: "D" },
    { label: t('apply.account.account_holder_info.widowed'), value: "W" },
]

export const phone_types = (t: (key: string) => string) => [
  { label: t('apply.account.account_holder_info.mobile'), value: "Mobile" },
  { label: t('apply.account.account_holder_info.home'), value: "Home" },
]

export const id_type = (t: (key: string) => string) => [
    { label: t('apply.account.account_holder_info.passport'), value: "Passport" },
    { label: t('apply.account.account_holder_info.national_id'), value: "National ID Card" },
    { label: t('apply.account.account_holder_info.license'), value: "Driver License" },
]

export const employment_status = (t: (key: string) => string) => [
  { value: 'EMPLOYED', label: t('apply.account.account_holder_info.employment_types.employed') }, 
  { value: 'SELFEMPLOYED', label: t('apply.account.account_holder_info.employment_types.self_employed') }, 
  { value: 'UNEMPLOYED', label: t('apply.account.account_holder_info.employment_types.unemployed') }, 
  { value: 'STUDENT', label: t('apply.account.account_holder_info.employment_types.student') }, 
  { value: 'RETIRED', label: t('apply.account.account_holder_info.employment_types.retired') }, 
  { value: 'OTHER', label: t('apply.account.account_holder_info.employment_types.other') }
]

export const account_types = (t: (key: string) => string) => [
  { label: t('apply.account.account_holder_info.cash_account'), value: "Cash" },
  { label: t('apply.account.account_holder_info.margin_account'), value: "Margin" },
]

export const sources_of_wealth = (t: (key: string) => string) => [
  {
    id: "SOW-IND-Income",
    label: t('apply.account.financial.sources_of_wealth.income')
  },
  {
    id: "SOW-IND-Inheritance",
    label: t('apply.account.financial.sources_of_wealth.inheritance')
  },
  {
    id: "SOW-IND-Interest",
    label: t('apply.account.financial.sources_of_wealth.interest')
  },
  {
    id: "SOW-IND-MarketProfit",
    label: t('apply.account.financial.sources_of_wealth.market_profit')
  },
  {
    id: "SOW-IND-Property",
    label: t('apply.account.financial.sources_of_wealth.property')
  },
  {
    id: "SOW-IND-Pension",
    label: t('apply.account.financial.sources_of_wealth.pension')
  },
  {
    id: "SOW-IND-Allowance",
    label: t('apply.account.financial.sources_of_wealth.allowance')
  },
  {
    id: "SOW-IND-Disability",
    label: t('apply.account.financial.sources_of_wealth.disability')
  },
  {
    id: "SOW-IND-Other",
    label: t('apply.account.financial.sources_of_wealth.other')
  },
]

export const investment_objectives = (t: (key: string) => string) => [
  {
    id: "Growth",
    label: t('apply.account.financial.investment_objectives_list.growth')
  },
  {
    id: "Trading",
    label: t('apply.account.financial.investment_objectives_list.trading')
  },
  {
    id: "Income",
    label: t('apply.account.financial.investment_objectives_list.income')
  },
  {
    id: "Hedging",
    label: t('apply.account.financial.investment_objectives_list.hedging')
  },
  {
    id: "Speculation",
    label: t('apply.account.financial.investment_objectives_list.speculation')
  }
]

export const regulatory_codes = (t: (key: string) => string) => [
  {
    code: "AFFILIATION",
    label: t('apply.account.regulatory.affiliation'),
    positive: t('apply.account.regulatory.affiliation_yes'),
    negative: t('apply.account.regulatory.affiliation_no')
  },
  {
    code: "EmployeePubTrade",
    label: t('apply.account.regulatory.employee_pub_trade'),
    positive: t('apply.account.regulatory.employee_pub_trade_yes'),
    negative: t('apply.account.regulatory.employee_pub_trade_no')
  },
  {
    code: "ControlPubTraded",
    label: t('apply.account.regulatory.control_pub_traded'),
    positive: t('apply.account.regulatory.control_pub_traded_yes'),
    negative: t('apply.account.regulatory.control_pub_traded_no')
  }
]

export const trading_products = (t: (key: string) => string) => [
  {
    id: "BONDS",
    label: t('apply.account.financial.products.bonds')
  },
  {
    id: "MUTUAL FUNDS",
    label: t('apply.account.financial.products.mutual_funds')
  },
  {
    id: "STOCKS",
    label: t('apply.account.financial.products.stocks')
  },
  {
    id: "OPTIONS",
    label: t('apply.account.financial.products.options')
  },
  {
    id: "FUTURES",
    label: t('apply.account.financial.products.futures')
  }
]

export const trading_countries = [
  "UNITED STATES",
  "CANADA",
  "UNITED KINGDOM",
  "GERMANY",
  "JAPAN",
  "AUSTRALIA"
]