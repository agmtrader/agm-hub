import { z } from 'zod';

export const poa_schema = z.object({
  type: z.enum(["Utility Bill", "Bank Statement", "Tax Return"]),
  issued_date: z.date(),
})

export const poi_schema = z.object({
  gender: z.string(),
  country_of_issue: z.string(),
  type: z.enum(["National ID Card", "Driver License", "Passport"]),
  full_name: z.string(),
  id_number: z.string(),
  issued_date: z.date(),
  date_of_birth: z.date(),
  expiration_date: z.date(),
  country_of_birth: z.string(),
})

export const sow_schema = z.object({
  issued_date: z.date(),
})

// Base Schemas
export const name_schema = z.object({
  first: z.string().min(1, { message: 'First name is required' }),
  last: z.string().min(1, { message: 'Last name is required' }),
  middle: z.string().optional(),
  salutation: z.string().optional(), // e.g., Mr, Ms, Dr
});

export const address_schema = z.object({
  country: z.string().min(2, { message: 'Country is required (2 or 3 letter ISO code)' }), // ISO 3166-1 alpha-2 or alpha-3
  street1: z.string().min(1, { message: 'Street address is required' }),
  street2: z.string().optional().nullable(),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().optional(), // Or province/region
  postalCode: z.string().min(1, { message: 'Postal code is required' }),
  compact: z.string().optional(), // Concatenated address
  type: z.string().optional(), // e.g., RESIDENTIAL, BUSINESS, MAILING
});

export const phone_schema = z.object({
  type: z.string().optional(), // e.g., Mobile, Home, Work
  country: z.string().min(2, { message: 'Phone country code is required' }),
  number: z.string().min(1, { message: 'Phone number is required' }),
  verified: z.boolean().optional(),
  primary: z.boolean().optional(),
});

export const identification_schema = z.object({
  // Common fields, can be extended by specific ID types
  passport: z.string().optional(),
  nationalCard: z.string().optional(),
  driversLicense: z.string().optional(),
  issuingCountry: z.string().optional(),
  expirationDate: z.string().optional(), // YYYY-MM-DD
  citizenship: z.string().optional(),
});

export const employment_details_schema = z.object({
  employer: z.string().optional(),
  occupation: z.string().optional(),
  employerAddress: address_schema.optional(),
  yearsWithEmployer: z.number().int().positive().optional(),
  employerBusiness: z.string().optional(),
});

export const investment_experience_schema = z.object({
  assetClass: z.string().min(1, { message: 'Asset class is required' }), // e.g., STK, OPT, FUT, FX
  yearsTrading: z.number().int().min(0, { message: 'Years trading must be non-negative' }),
  tradesPerYear: z.number().int().min(0, { message: 'Trades per year must be non-negative' }),
  knowledgeLevel: z.string().min(1, { message: 'Knowledge level is required' }), // e.g., None, Limited, Good, Extensive
});

export const source_of_wealth_schema = z.object({
  sourceType: z.string().min(1, { message: 'Source type is required' }), // e.g., SOW-IND-Income, SOW-IND-Investments
  percentage: z.number().int().min(0).max(100).optional(),
  usedForFunds: z.boolean().optional(),
  description: z.string().optional(),
});

export const regulatory_detail_schema = z.object({
  code: z.string().min(1, { message: 'Regulatory code is required' }),
  status: z.boolean(),
  details: z.string().optional(),
  detail: z.string().optional(), // IBKR seems to use both 'details' and 'detail'
  externalIndividualId: z.string().optional(),
});

export const trading_permission_schema = z.object({
  country: z.string().min(1, { message: 'Trading permission country is required' }),
  product: z.string().min(1, { message: 'Trading permission product is required' }), // e.g., STOCKS, OPTIONS
});

// Base Schemas for Trading Limits and Privileges
export const order_value_limits_schema = z.object({
  maxOrderValue: z.number(),
  maxGrossValue: z.number(),
  maxNetValue: z.number(),
  netContractLimit: z.number(),
});

export const efp_quantity_limits_schema = z.object({
  maxNominalEfpPerOrder: z.number(),
  maxNetEfpTrades: z.number(),
  maxGrossEfpTrades: z.number(),
});

const asset_enum_values: [string, ...string[]] = ["BILL", "BOND", "CASH", "CFD", "COMB", "FOP", "FUND", "FUT", "OPT", "SSF", "STK", "WAR", "MRGN"];
export const order_quantity_limit_schema = z.object({
  asset: z.enum(asset_enum_values),
  quantity: z.number(),
});

export const day_quantity_limit_schema = z.object({
  asset: z.enum(asset_enum_values),
  quantity: z.number(),
});

export const trading_limits_schema = z.object({
  orderValueLimits: order_value_limits_schema,
  efpQuantityLimits: efp_quantity_limits_schema,
  orderQuantityLimits: z.array(order_quantity_limit_schema),
  dayQuantityLimits: z.array(day_quantity_limit_schema),
}).optional(); // Making optional as it's optional in Account schema based on original types

const privilege_enum_values: [string, ...string[]] = ["OWNER", "TRADER", "CUSTOM", "NONE"];
export const user_privilege_schema = z.object({
  externalAccountId: z.string(),
  privilege: z.enum(privilege_enum_values),
}).optional(); // Making optional as it's optional in User schema

export const tax_residency_schema = z.object({
  country: z.string().min(2, { message: 'Country code is required' }),
  tin: z.string().min(1, { message: 'TIN is required' }),
  tinType: z.enum(['SSN', 'EIN', 'NonUS_NationalId']),
});

export const financial_information_schema = z.object({
  investmentExperience: z.array(investment_experience_schema).min(1, { message: 'At least one investment experience is required' }),
  investmentObjectives: z.array(z.string()).min(1, { message: 'At least one investment objective is required' }),
  sourcesOfWealth: z.array(source_of_wealth_schema).min(1, { message: 'At least one source of wealth is required' }),
  netWorth: z.number().int({ message: 'Net worth must be an integer' }),
  liquidNetWorth: z.number().int({ message: 'Liquid net worth must be an integer' }),
  annualNetIncome: z.number().int({ message: 'Annual net income must be an integer' }),
  taxBracket: z.string().optional(),
  accreditedInvestor: z.boolean().optional(),
});

export const regulatory_information_schema = z.object({
  regulatoryDetails: z.array(regulatory_detail_schema).min(1, { message: 'At least one regulatory detail is required' }),
});

export const account_schema = z.object({
  investmentObjectives: z.array(z.string()).min(1, { message: 'At least one account investment objective is required' }),
  tradingPermissions: z.array(trading_permission_schema).min(1, { message: 'At least one trading permission is required' }),
  externalId: z.string().min(1, { message: 'Account external ID is required' }),
  baseCurrency: z.string().min(3, { message: 'Base currency is required (3-letter code)' }),
  multiCurrency: z.boolean().optional().default(true),
  margin: z.string().min(1, { message: 'Margin type is required' }),
  tradingLimits: trading_limits_schema, // Added from new schema
  alias: z.string().optional(),
});

export const user_schema = z.object({
  userPrivileges: z.array(user_privilege_schema).optional(),
  externalUserId: z.string().min(1, { message: 'External user ID is required' }),
  externalIndividualId: z.string().min(1, { message: 'External individual ID for user is required' }),
  prefix: z.string().min(1, { 
    message: 'User prefix is required'
  }),
  // other user fields
});

export const ibkr_document_schema = z.object({
  signedBy: z.array(z.string()),
  attachedFile: z.object({
    fileName: z.string(),
    fileLength: z.number(),
    sha1Checksum: z.string(),
  }).optional(),
  formNumber: z.number(),
  validAddress: z.boolean().optional(),
  execLoginTimestamp: z.number(),
  execTimestamp: z.number(),
  proofOfIdentityType: z.string().optional(),
  proofOfAddressType: z.string().optional(),
  payload: z.object({
    mimeType: z.string(),
    data: z.string(),
  }).optional(),
}).optional();

export const add_additional_account_schema = z.object({
  // Define if needed, similar to ibkr_document_schema
}).optional();

export const local_tax_form_schema = z.object({
  taxAuthority: z.string(),
  qualified: z.boolean(),
  treatyCountry: z.string(),
})

export const w8ben_schema = z.object({
  localTaxForms: z.array(local_tax_form_schema),
  name: z.string().optional(),
  tin: z.string().optional(),
  foreignTaxId: z.string().optional(),
  tinOrExplanationRequired: z.boolean().optional(),
  explanation: z.string().optional(),
  referenceNumber: z.number().optional(),
  part29ACountry: z.string().optional(),
  cert: z.boolean().optional(),
  signatureType: z.string().optional(),
  blankForm: z.boolean().optional(),
  taxFormFile: z.string().optional(),
  proprietaryFormNumber: z.number().optional(),
  electronicFormat: z.boolean().optional(),
  submitDate: z.string().optional(),
})

// Nested Schemas for Application Structure
export const account_holder_details_schema = z.object({
  externalId: z.string().min(1, { message: 'External ID for account holder is required' }),
  name: name_schema,
  email: z.string().email({ message: 'Invalid email address' }),
  residenceAddress: address_schema,
  mailingAddress: address_schema.optional(),
  sameMailAddress: z.boolean().optional(),
  countryOfBirth: z.string().min(2, { message: 'Country of birth is required' }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date of birth must be YYYY-MM-DD' }),
  gender: z.string().optional(), // e.g., MALE, FEMALE, OTHER
  maritalStatus: z.string().optional(), // e.g., S, M, D
  numDependents: z.number().int().min(0).optional(),
  phones: z.array(phone_schema).min(1, { message: 'At least one phone number is required' }),
  identification: identification_schema, // This might need to be more specific based on individual vs org
  employmentDetails: employment_details_schema,
  isPEP: z.boolean().optional(), // Politically Exposed Person
  isControlPerson: z.boolean().optional(),
  employmentType: z.string().min(1, { message: 'Employment type is required' }),
  taxResidencies: z.array(tax_residency_schema),
  w8Ben: w8ben_schema.optional(),
  authorizedToSignOnBehalfOfOwner: z.boolean().optional(),
  authorizedTrader: z.boolean().optional(),
  usTaxResident: z.boolean().optional(),
  ownershipPercentage: z.number().int().min(0).max(100).optional(),
  titles: z.array(z.object({
    value: z.string(),
    code: z.string()
  })).optional(),
});

export const individual_applicant_schema = z.object({
  accountHolderDetails: z.array(account_holder_details_schema).min(1, { message: 'Account holder details are required' }),
  financialInformation: z.array(financial_information_schema).min(1, { message: 'Financial information is required' }),
  regulatoryInformation: z.array(regulatory_information_schema).min(1, { message: 'Regulatory information is required' }),
});

export const joint_applicant_schema = z.object({
  accountHolderDetails: z.array(account_holder_details_schema).min(1, { message: 'Account holder details are required' }),
  financialInformation: z.array(financial_information_schema).min(1, { message: 'Financial information is required' }),
  regulatoryInformation: z.array(regulatory_information_schema).min(1, { message: 'Regulatory information is required' }),
});

// Joint Holders Schema - matching IBKR API structure
export const joint_holders_schema = z.object({
  firstHolderDetails: z.array(account_holder_details_schema).min(1, { message: 'First holder details are required' }),
  secondHolderDetails: z.array(account_holder_details_schema).min(1, { message: 'Second holder details are required' }),
  financialInformation: z.array(financial_information_schema).min(1, { message: 'Financial information is required' }),
  regulatoryInformation: z.array(regulatory_information_schema).min(1, { message: 'Regulatory information is required' }),
  type: z.enum(['community', 'joint_tenants', 'tenants_common', 'tbe', 'au_joint_account']),
}).optional();



// Organization Account Schemas
export const organization_identification_schema = z.object({
  placeOfBusinessAddress: address_schema,
  mailingAddress: address_schema.optional(),
  phones: z.array(phone_schema).optional(),
  name: z.string(),
  businessDescription: z.string().optional(),
  websiteAddress: z.string().optional(),
  identification: z.string(),
  identificationCountry: z.string().optional(),
  formationCountry: z.string().optional(),
  formationState: z.string().optional(),
  sameMailAddress: z.boolean().optional(),
  translated: z.boolean().optional(),
});

export const organization_associated_entities_schema = z.object({
  associatedIndividuals: z.array(account_holder_details_schema).optional(),
  associatedEntities: z.array(z.any()).optional(),
});

export const organization_account_support_schema = z.object({
  businessDescription: z.string().optional(),
  ownersResideUS: z.boolean().optional(),
  type: z.string().optional(),
});

export const organization_schema = z.object({
  identifications: z.array(organization_identification_schema).min(1),
  accountSupport: organization_account_support_schema.optional(),
  associatedEntities: organization_associated_entities_schema.optional(),
  financialInformation: z.array(financial_information_schema).min(1),
  regulatoryInformation: z.array(regulatory_information_schema).min(1),
  accreditedInvestorInformation: z.any().optional(),
  regulatedMemberships: z.any().optional(),
}).optional();

// Main Schemas
export const customer_schema = z.object({
  accountHolder: individual_applicant_schema.optional(), // For INDIVIDUAL accounts
  jointHolders: joint_holders_schema, // For JOINT accounts
  organization: organization_schema, // For ORG accounts
  externalId: z.string().min(1, { message: 'Customer external ID is required' }),
  type: z.enum(['INDIVIDUAL', 'JOINT', 'ORG'], { message: 'Account type is required' }),
  prefix: z.string().min(3, { message: 'Prefix must be at least 3 characters' }).max(6, { message: 'Prefix must be at most 6 characters' }),
  email: z.string().email(),
  mdStatusNonPro: z.boolean().optional().default(true),
  meetAmlStandard: z.string().optional().default('true'),
  directTradingAccess: z.boolean().optional().default(true),
  legalResidenceCountry: z.string().min(2),
}).refine((data) => {
  if (data.type === 'INDIVIDUAL' && !data.accountHolder) return false;
  if (data.type === 'JOINT' && !data.jointHolders) return false;
  if (data.type === 'ORG' && !data.organization) return false;
  return true;
}, {
  message: 'Customer information does not match account type',
});

export const application_schema = z.object({
  customer: customer_schema,
  accounts: z.array(account_schema).min(1, { message: 'At least one account is required' }),
  users: z.array(user_schema).min(1, { message: 'At least one user is required' }),
  documents: z.array(ibkr_document_schema).optional(),
  additionalAccounts: z.array(add_additional_account_schema).optional().nullable(),
  masterAccountId: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  inputLanguage: z.enum(['en', 'zh-Hans', 'ja', 'ru', 'fr', 'pt', 'es', 'it', 'ar-AE', 'de', 'he-IL', 'hu']).optional().nullable(),
  translation: z.boolean().optional().nullable(),
  paperAccount: z.boolean().optional().nullable(),
});