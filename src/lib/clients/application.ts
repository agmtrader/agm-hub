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
    w8ben_schema,
    employment_type_values
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
    referrer?: string | null;
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

type TranslateFn = ((key: string) => string) | undefined

const labelOr = (t: TranslateFn, key: string, fallback: string) => (t ? t(key) : fallback)

export const knowledge_levels = (t?: TranslateFn) => [
  { label: labelOr(t, 'apply.account.financial.knowledge_levels.none', 'None'), value: "None" },
  { label: labelOr(t, 'apply.account.financial.knowledge_levels.limited', 'Limited'), value: "Limited" },
  { label: labelOr(t, 'apply.account.financial.knowledge_levels.good', 'Good'), value: "Good" },
  { label: labelOr(t, 'apply.account.financial.knowledge_levels.extensive', 'Extensive'), value: "Extensive" },
]

export const asset_classes = (t?: TranslateFn) => [
  { label: labelOr(t, 'apply.account.financial.products.bonds', 'Bonds'), value: "BOND" },
  { label: 'Cash', value: "CASH" },
  { label: 'CFDs', value: "CFD" },
  { label: 'Combination Products', value: "COMB" },
  { label: 'Futures Options', value: "FOP" },
  { label: labelOr(t, 'apply.account.financial.products.etfs', 'ETFs'), value: "FUND" },
  { label: 'Single Stock Futures', value: "SSF" },
  { label: labelOr(t, 'apply.account.financial.products.stocks', 'Stocks'), value: "STK" },
  { label: labelOr(t, 'apply.account.financial.products.options', 'Options'), value: "OPT" },
  { label: labelOr(t, 'apply.account.financial.products.futures', 'Futures'), value: "FUT" },
  { label: 'Warrants', value: "WAR" },
  { label: 'Margin', value: "MRGN" },
  { label: 'Bills', value: "BILL" },
]

export const marital_status = (t?: TranslateFn) => [
  { label: labelOr(t, 'apply.account.account_holder_info.single', 'Single'), value: "S" },
  { label: labelOr(t, 'apply.account.account_holder_info.married', 'Married'), value: "M" },
  { label: labelOr(t, 'apply.account.account_holder_info.divorced', 'Divorced'), value: "D" },
  { label: labelOr(t, 'apply.account.account_holder_info.widowed', 'Widowed'), value: "W" },
]

export const phone_types = (t?: TranslateFn) => [
  { label: labelOr(t, 'apply.account.account_holder_info.mobile', 'Mobile'), value: "Mobile" },
  { label: labelOr(t, 'apply.account.account_holder_info.home', 'Home'), value: "Home" },
]

export const id_type = (t?: TranslateFn) => [
  { label: labelOr(t, 'apply.account.account_holder_info.passport', 'Passport'), value: "Passport" },
  { label: labelOr(t, 'apply.account.account_holder_info.national_id', 'National ID Card'), value: "National ID Card" },
  { label: labelOr(t, 'apply.account.account_holder_info.license', 'Driver License'), value: "Driver License" },
]

export const employment_status = (t?: TranslateFn) => [
  { value: employment_type_values[0], label: labelOr(t, 'apply.account.account_holder_info.employment_types.employed', 'Employed') },
  { value: employment_type_values[1], label: labelOr(t, 'apply.account.account_holder_info.employment_types.self_employed', 'Self-employed') },
  { value: employment_type_values[2], label: labelOr(t, 'apply.account.account_holder_info.employment_types.unemployed', 'Unemployed') },
  { value: employment_type_values[3], label: labelOr(t, 'apply.account.account_holder_info.employment_types.retired', 'Retired') },
  { value: employment_type_values[4], label: labelOr(t, 'apply.account.account_holder_info.employment_types.student', 'Student') },
  { value: employment_type_values[5], label: labelOr(t, 'apply.account.account_holder_info.employment_types.at_home_trader', 'At-home trader') },
  { value: employment_type_values[6], label: labelOr(t, 'apply.account.account_holder_info.employment_types.homemaker', 'Homemaker') },
]

export const account_types = (t?: TranslateFn) => [
  { label: labelOr(t, 'apply.account.account_holder_info.cash_account', 'Cash'), value: "Cash" },
  { label: labelOr(t, 'apply.account.account_holder_info.margin_account', 'Margin'), value: "Margin" },
]

export const sources_of_wealth = (t?: TranslateFn) => [
  { id: "SOW-IND-Income", label: labelOr(t, 'apply.account.financial.sources_of_wealth.income', 'Income') },
  { id: "SOW-IND-Inheritance", label: labelOr(t, 'apply.account.financial.sources_of_wealth.inheritance', 'Inheritance') },
  { id: "SOW-IND-Interest", label: labelOr(t, 'apply.account.financial.sources_of_wealth.interest', 'Interest') },
  { id: "SOW-IND-MarketProfit", label: labelOr(t, 'apply.account.financial.sources_of_wealth.market_profit', 'Market Profit') },
  { id: "SOW-IND-Property", label: labelOr(t, 'apply.account.financial.sources_of_wealth.property', 'Property') },
  { id: "SOW-IND-Pension", label: labelOr(t, 'apply.account.financial.sources_of_wealth.pension', 'Pension') },
  { id: "SOW-IND-Allowance", label: labelOr(t, 'apply.account.financial.sources_of_wealth.allowance', 'Allowance') },
  { id: "SOW-IND-Disability", label: labelOr(t, 'apply.account.financial.sources_of_wealth.disability', 'Disability') },
  { id: "SOW-IND-Other", label: labelOr(t, 'apply.account.financial.sources_of_wealth.other', 'Other') },
]

export const investment_objectives = (t?: TranslateFn) => [
  { id: "Growth", label: labelOr(t, 'apply.account.financial.investment_objectives_list.growth', 'Growth') },
  { id: "Trading", label: labelOr(t, 'apply.account.financial.investment_objectives_list.trading', 'Trading') },
  { id: "Income", label: labelOr(t, 'apply.account.financial.investment_objectives_list.income', 'Income') },
  { id: "Hedging", label: labelOr(t, 'apply.account.financial.investment_objectives_list.hedging', 'Hedging') },
  { id: "Speculation", label: labelOr(t, 'apply.account.financial.investment_objectives_list.speculation', 'Speculation') },
]

export const regulatory_codes = (t?: TranslateFn) => [
  {
    code: "AFFILIATION",
    label: labelOr(t, 'apply.account.regulatory.affiliation', 'Affiliation'),
    positive: labelOr(t, 'apply.account.regulatory.affiliation_yes', 'Yes'),
    negative: labelOr(t, 'apply.account.regulatory.affiliation_no', 'No'),
  },
  {
    code: "EmployeePubTrade",
    label: labelOr(t, 'apply.account.regulatory.employee_pub_trade', 'Employee Public Trade'),
    positive: labelOr(t, 'apply.account.regulatory.employee_pub_trade_yes', 'Yes'),
    negative: labelOr(t, 'apply.account.regulatory.employee_pub_trade_no', 'No'),
  },
  {
    code: "ControlPubTraded",
    label: labelOr(t, 'apply.account.regulatory.control_pub_traded', 'Control Public Traded'),
    positive: labelOr(t, 'apply.account.regulatory.control_pub_traded_yes', 'Yes'),
    negative: labelOr(t, 'apply.account.regulatory.control_pub_traded_no', 'No'),
  },
]

export const affiliation_relationships = (t?: TranslateFn) => [
  { label: labelOr(t, 'apply.account.regulatory.affiliation_fields.relationships.other', 'Other'), value: "Other" },
  { label: labelOr(t, 'apply.account.regulatory.affiliation_fields.relationships.spouse', 'Spouse'), value: "Spouse" },
  { label: labelOr(t, 'apply.account.regulatory.affiliation_fields.relationships.parent', 'Parent'), value: "Parent" },
  { label: labelOr(t, 'apply.account.regulatory.affiliation_fields.relationships.child', 'Child'), value: "Child" },
  { label: labelOr(t, 'apply.account.regulatory.affiliation_fields.relationships.self', 'Self'), value: "Self" },
]

export const trading_products = (t?: TranslateFn) => [
  { id: "BONDS", label: labelOr(t, 'apply.account.financial.products.bonds', 'Bonds') },
  { id: "MUTUAL FUNDS", label: labelOr(t, 'apply.account.financial.products.mutual_funds', 'Mutual Funds') },
  { id: "STOCKS", label: labelOr(t, 'apply.account.financial.products.stocks', 'Stocks') },
  { id: "OPTIONS", label: labelOr(t, 'apply.account.financial.products.options', 'Options') },
  { id: "FUTURES", label: labelOr(t, 'apply.account.financial.products.futures', 'Futures') },
]

export const trading_countries = [
  "UNITED STATES",
  "CANADA",
  "UNITED KINGDOM",
  "GERMANY",
  "JAPAN",
  "AUSTRALIA"
]
