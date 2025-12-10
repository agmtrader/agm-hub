import { z } from 'zod';

export const affiliation_details_schema = z.object({
  isDuplicateStmtRequired: z.boolean().optional().default(true),
  affiliationRelationship: z.enum(['Other', 'Spouse', 'Parent', 'Child', 'Self']).optional().nullable(),
  personName: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  companyPhone: z.string().optional().nullable(),
  companyEmailAddress: z.string().email({ message: 'Invalid company email' }).optional().nullable(),
  country: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
});

export const poa_schema = z.object({
  type: z.enum(["Utility Bill", "Bank Statement", "Tax Return", "Marriage Certificate", "Other"]),
})

export const poi_schema = z.object({
  type: z.enum(["National ID Card", "Driver License", "Passport", "Other"]),
})

// Proof of Existence for legal persons and trusts
export const poe_schema = z.object({
  type: z.enum(['Business Registration', 'Articles of Incorporation', 'Company Charter', 'Partnership Agreement', 'Government-issued business license', 'Government-issued Certificate of Good Standing from the Jurisdiction of Incorporation', 'Business Registration', 'Regulatory Registration License', 'Other']),
})

// Proof of Existence for individuals
export const sow_schema = z.object({
  type: z.enum(["Bank Statement", "Tax Return", "Other", "Other"]),
})

// Base Schemas
export const name_schema = z.object({
  first: z.string().optional().nullable(),
  last: z.string().optional().nullable(),
  middle: z.string().optional().nullable(),
  salutation: z.string().optional().nullable(),
});

export const address_schema = z.object({
  country: z.string().optional().nullable(),
  street1: z.string().optional().nullable(),
  street2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  compact: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
});

export const phone_schema = z.object({
  type: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  verified: z.boolean().optional(),
  primary: z.boolean().optional(),
});

export const identification_schema = z.object({
  passport: z.string().optional().nullable(),
  nationalCard: z.string().optional().nullable(),
  driversLicense: z.string().optional().nullable(),
  issuingCountry: z.string().optional().nullable(),
  expirationDate: z.string().optional().nullable(),
  citizenship: z.string().optional().nullable(),
});

export const employment_details_schema = z.object({
  employer: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  employerAddress: address_schema.optional().nullable(),
  yearsWithEmployer: z.number().int().optional().nullable(),
  employerBusiness: z.string().optional().nullable(),
  emplCountryResCountryDetails: z.string().optional().nullable()
});

export const investment_experience_schema = z.object({
  assetClass: z.string().optional().nullable(),
  yearsTrading: z.number().int().optional().nullable(),
  tradesPerYear: z.number().int().optional().nullable(),
  knowledgeLevel: z.string().optional().nullable(),
});

export const source_of_wealth_schema = z.object({
  sourceType: z.string().optional().nullable(),
  percentage: z.number().int().optional().nullable(),
  usedForFunds: z.boolean().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const regulatory_detail_schema = z.object({
  code: z.string().optional().nullable(),
  status: z.boolean(),
  details: z.string().optional().nullable(),
  detail: z.string().optional().nullable(),
  externalIndividualId: z.string().optional().nullable(),
  affiliation: affiliation_details_schema.optional().nullable(),
});

export const trading_permission_schema = z.object({
  country: z.string().optional().nullable(),
  product: z.string().optional().nullable(),
});

export const order_value_limits_schema = z.object({
  maxOrderValue: z.number().optional().nullable(),
  maxGrossValue: z.number().optional().nullable(),
  maxNetValue: z.number().optional().nullable(),
  netContractLimit: z.number().optional().nullable(),
});

export const efp_quantity_limits_schema = z.object({
  maxNominalEfpPerOrder: z.number().optional().nullable(),
  maxNetEfpTrades: z.number().optional().nullable(),
  maxGrossEfpTrades: z.number().optional().nullable(),
});

const asset_enum_values: [string, ...string[]] = ["BILL", "BOND", "CASH", "CFD", "COMB", "FOP", "FUND", "FUT", "OPT", "SSF", "STK", "WAR", "MRGN"];
export const order_quantity_limit_schema = z.object({
  asset: z.enum(asset_enum_values),
  quantity: z.number().optional().nullable(),
});

export const day_quantity_limit_schema = z.object({
  asset: z.enum(asset_enum_values),
  quantity: z.number().optional().nullable(),
});

export const trading_limits_schema = z.object({
  orderValueLimits: order_value_limits_schema,
  efpQuantityLimits: efp_quantity_limits_schema,
  orderQuantityLimits: z.array(order_quantity_limit_schema),
  dayQuantityLimits: z.array(day_quantity_limit_schema),
}).optional(); // Making optional as it's optional in Account schema based on original types

const privilege_enum_values: [string, ...string[]] = ["OWNER", "TRADER", "CUSTOM", "NONE"];
export const user_privilege_schema = z.object({
  externalAccountId: z.string().optional().nullable(),
  privilege: z.enum(privilege_enum_values),
}).optional(); // Making optional as it's optional in User schema

export const tax_residency_schema = z.object({
  country: z.string().optional().nullable(),
  tin: z.string().optional().nullable(),
  tinType: z.enum(['SSN', 'EIN', 'NonUS_NationalId']).optional().nullable(),
});

export const financial_information_schema = z.object({
  investmentExperience: z.array(investment_experience_schema).optional().nullable(),
  investmentObjectives: z.array(z.string()).optional().nullable(),
  sourcesOfWealth: z.array(source_of_wealth_schema).optional().nullable(),
  netWorth: z.number().int().optional().nullable(),
  liquidNetWorth: z.number().int().optional().nullable(),
  annualNetIncome: z.number().int().optional().nullable(),
  taxBracket: z.string().optional().nullable(),
  accreditedInvestor: z.boolean().optional().nullable(),
});

export const regulatory_information_schema = z
  .object({
    regulatoryDetails: z
      .array(regulatory_detail_schema)
      .optional(),
  })
  .superRefine((val, ctx) => {
    const detailsList = val.regulatoryDetails || [];

    const requiresTickerCodes = new Set(["EmployeePubTrade", "ControlPubTraded"]);

    detailsList.forEach((detail, index) => {
      // Normalize
      const code = detail.code;
      const isYes = Boolean(detail.status);

      if (!isYes) return; // Only validate details when status is Yes

      // AFFILIATION must include a full affiliation object when Yes
      if (code === "AFFILIATION") {
        if (!('affiliation' in detail) || !detail.affiliation) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Affiliation details are required",
            path: ["regulatoryDetails", index, "affiliation"],
          });
          return;
        }
        const parsed = affiliation_details_schema.safeParse(detail.affiliation);
        if (!parsed.success) {
          parsed.error.issues.forEach((issue) =>
            ctx.addIssue({ ...issue, path: ["regulatoryDetails", index, "affiliation", ...(issue.path || [])] })
          );
        }
        return;
      }

      // EmployeePubTrade / ControlPubTraded must have uppercase tickers list
      if (requiresTickerCodes.has(code ?? "")) {
        const value = (detail.details ?? "").trim();
        if (!value) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter one or more stock symbols, separated by commas",
            path: ["regulatoryDetails", index, "details"],
          });
          return;
        }

        const tokens = value.split(",").map((s) => s.trim()).filter(Boolean);
        if (tokens.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter one or more stock symbols, separated by commas",
            path: ["regulatoryDetails", index, "details"],
          });
          return;
        }

        // Validate uppercase (letters and digits allowed, simple rule)
        const hasInvalid = tokens.some((t) => t !== t.toUpperCase());
        if (hasInvalid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Stock symbols must be UPPER CASE and separated by commas",
            path: ["regulatoryDetails", index, "details"],
          });
        }
      }
    });
  });

export const account_schema = z.object({
  investmentObjectives: z.array(z.string()).optional().nullable(),
  tradingPermissions: z.array(trading_permission_schema).nullable().optional(),
  externalId: z.string().min(1, { message: 'Account external ID is required' }),  
  baseCurrency: z.string().nullable().optional(),
  multiCurrency: z.boolean().optional().default(true),
  margin: z.string().nullable().optional(),
  tradingLimits: trading_limits_schema,
  alias: z.string().optional().nullable(),
  feesTemplateName: z.string().optional().nullable(),
});

export const user_schema = z.object({
  userPrivileges: z.array(user_privilege_schema).optional().nullable(),
  externalUserId: z.string().min(1, { message: 'External user ID is required' }),
  externalIndividualId: z.string().min(1, { message: 'External individual ID for user is required' }),
  prefix: z.string().optional().nullable(),
});

export const ibkr_document_schema = z.object({
  signedBy: z.array(z.string()).optional().nullable(),
  attachedFile: z.object({
    fileName: z.string().optional().nullable(),
    fileLength: z.number().optional().nullable(),
    sha1Checksum: z.string().optional().nullable(),
  }).optional(),
  formNumber: z.number().optional().nullable(),
  validAddress: z.boolean().optional(),
  execLoginTimestamp: z.number(),
  execTimestamp: z.number(),
  proofOfIdentityType: z.string().optional().nullable(),
  proofOfAddressType: z.string().optional().nullable(),
  payload: z.object({
    mimeType: z.string(),
    data: z.string(),
  }).optional(),
  issuedDate: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
}).optional();

export const add_additional_account_schema = z.object({
  // Define if needed, similar to ibkr_document_schema
}).optional();

export const local_tax_form_schema = z.object({
  taxAuthority: z.string().optional().nullable(),
  qualified: z.boolean().optional().nullable(),
  treatyCountry: z.string().optional().nullable(),
})

export const w8ben_schema = z.object({
  localTaxForms: z.array(local_tax_form_schema),
  name: z.string().optional().nullable(),
  tin: z.string().optional().nullable(),
  foreignTaxId: z.string().optional().nullable(),
  tinOrExplanationRequired: z.boolean().optional().nullable(),
  explanation: z.string().optional().nullable(),
  referenceNumber: z.number().optional().nullable(),
  part29ACountry: z.string().optional().nullable(),
  cert: z.boolean().optional().nullable(),
  signatureType: z.string().optional().nullable(),
  blankForm: z.boolean().optional().nullable(),
  taxFormFile: z.string().optional().nullable(),
  proprietaryFormNumber: z.number().optional().nullable(),
  electronicFormat: z.boolean().optional().nullable(),
  submitDate: z.string().optional().nullable(),
})

// Nested Schemas for Application Structure
export const account_holder_details_schema = z.object({
  externalId: z.string().optional().nullable(),
  name: name_schema,
  email: z.string().optional().nullable(),
  residenceAddress: address_schema,
  mailingAddress: address_schema.optional().nullable(),
  sameMailAddress: z.boolean().optional().nullable(),
  countryOfBirth: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
  numDependents: z.number().int().optional().nullable(),
  phones: z.array(phone_schema).optional().nullable(),
  identification: identification_schema,
  employmentDetails: employment_details_schema.optional().nullable(),
  isPEP: z.boolean().optional().nullable(),
  isControlPerson: z.boolean().optional().nullable(),
  employmentType: z.string().optional().nullable(),
  taxResidencies: z.array(tax_residency_schema).optional().nullable(),
  w8Ben: w8ben_schema.optional().nullable(),
  authorizedToSignOnBehalfOfOwner: z.boolean().optional().nullable(),
  authorizedTrader: z.boolean().optional().nullable(),
  usTaxResident: z.boolean().optional().nullable(),
  ownershipPercentage: z.number().int().optional().nullable(),
  titles: z.array(z.object({
    value: z.string().optional().nullable(),
    code: z.string().optional().nullable()
  })).optional(),
});

export const individual_applicant_schema = z.object({
  accountHolderDetails: z.array(account_holder_details_schema).optional().nullable(),
  financialInformation: z.array(financial_information_schema).optional().nullable(),
  regulatoryInformation: z.array(regulatory_information_schema).optional().nullable(),
});

export const joint_applicant_schema = z.object({
  accountHolderDetails: z.array(account_holder_details_schema).optional().nullable(),
  financialInformation: z.array(financial_information_schema).optional().nullable(),
  regulatoryInformation: z.array(regulatory_information_schema).optional().nullable(),
});

// Joint Holders Schema - matching IBKR API structure
export const joint_holders_schema = z.object({
  firstHolderDetails: z.array(account_holder_details_schema).optional().nullable(),
  secondHolderDetails: z.array(account_holder_details_schema).optional().nullable(),
  financialInformation: z.array(financial_information_schema).optional().nullable(),
  regulatoryInformation: z.array(regulatory_information_schema).optional().nullable(),
  type: z.enum(['community', 'joint_tenants', 'tenants_common', 'tbe', 'au_joint_account']).optional().nullable(),
}).optional();

// Organization Account Schemas
export const organization_identification_schema = z.object({
  placeOfBusinessAddress: address_schema.optional().nullable(),
  mailingAddress: address_schema.optional().nullable(),
  phones: z.array(phone_schema).optional().nullable(),
  name: z.string().optional().nullable(),
  businessDescription: z.string().optional().nullable(),
  websiteAddress: z.string().optional().nullable(),
  identification: z.string().optional().nullable(),
  identificationCountry: z.string().optional().nullable(),
  formationCountry: z.string().optional().nullable(),
  formationState: z.string().optional().nullable(),
  sameMailAddress: z.boolean().optional().nullable(),
  translated: z.boolean().optional().nullable(),
});

export const organization_associated_entities_schema = z.object({
  associatedIndividuals: z.array(account_holder_details_schema).optional().nullable(),
  associatedEntities: z.array(z.any()).optional().nullable(),
});

export const organization_account_support_schema = z.object({
  businessDescription: z.string().optional().nullable(),
  ownersResideUS: z.boolean().optional().nullable(),
  type: z.string().optional().nullable(),
});

export const organization_schema = z.object({
  identifications: z.array(organization_identification_schema).optional().nullable(),
  accountSupport: organization_account_support_schema.optional().nullable(),
  associatedEntities: organization_associated_entities_schema.optional().nullable(),
  financialInformation: z.array(financial_information_schema).optional().nullable(),
  regulatoryInformation: z.array(regulatory_information_schema).optional().nullable(),
  accreditedInvestorInformation: z.any().optional().nullable(),
  regulatedMemberships: z.any().optional().nullable(),
}).optional();

// Main Schemas
export const customer_schema = z.object({
  accountHolder: individual_applicant_schema.optional(),
  jointHolders: joint_holders_schema,
  organization: organization_schema,
  externalId: z.string().optional().nullable(),
  type: z.enum(['INDIVIDUAL', 'JOINT', 'ORG'], { message: 'Account type is required' }),
  prefix: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  mdStatusNonPro: z.boolean().optional().default(true),
  meetAmlStandard: z.string().optional().default('true'),
  directTradingAccess: z.boolean().optional().default(true),
  legalResidenceCountry: z.string().optional().nullable(),
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
  accounts: z.array(account_schema).optional().nullable(),
  users: z.array(user_schema).optional().nullable(),
  documents: z.array(ibkr_document_schema).optional().nullable(),
  additionalAccounts: z.array(add_additional_account_schema).optional().nullable(),
  masterAccountId: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  inputLanguage: z.enum(['en', 'zh-Hans', 'ja', 'ru', 'fr', 'pt', 'es', 'it', 'ar-AE', 'de', 'he-IL', 'hu']).optional().nullable(),
  translation: z.boolean().optional().nullable(),
  paperAccount: z.boolean().optional().nullable()
});