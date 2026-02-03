import { IBKRDocument } from "./application"
import { Base } from "./base"
import { z } from "zod"
import { account_schema, deposit_instruction_schema, withdrawal_instruction_schema } from "./schemas/account"

export type AccountPayload = z.infer<typeof account_schema>
export type InternalAccount = AccountPayload & {
  ibkr_account_number: string,
  ibkr_username: string | null,
  ibkr_password: string | null,
  temporal_email: string | null,
  temporal_password: string | null,
  application_id: string,
  fee_template: string | null,
  master_account: 'ad' | 'br' | null,
  management_type: string | null,
  advisor_code: string | null,
  contact_id: string | null,
  emailed_credentials: boolean,
}
export type Account = Base & InternalAccount

// Account Management API
export interface AllForms {
  formDetails: FormDetails[]
  fileData: {
    data: string;
    name: string;
  }
}
export interface FormDetails {
  formNumber: string;
  sha1Checksum: string;
  dateModified: string;
  fileName: string;
  language: string;
  formName: string;
  fileLength: number;
}

export interface RegistrationTask {
  formName: string;
  action: string;
  isRequiredForApproval: boolean;
  isCompleted: boolean;
  state: string;
  dateCompleted?: string; 
}

export interface RegistrationTasksResponse {
  accountId: string;
  status: string;
  description: string;
  state: string;
  registrationTaskPresent: boolean;
  registrationTasks: RegistrationTask[];
}

export interface PendingTask {
  taskNumber: number;
  formNumber: number;
  formName: string;
  action: string;
  state: string;
  entityId: number;
  requiredForApproval: boolean;
  onlineTask: boolean;
  requiredForTrading: boolean;
}

export interface PendingTasksResponse {
  accountId: string;
  status: string;
  description: string;
  state: string;
  pendingTasks: PendingTask[];
  pendingTaskPresent: boolean;
}

export interface DocumentSubmissionRequest {
    documents: IBKRDocument[];
    accountId: string;
    inputLanguage: string;
    translation: boolean;
}

export interface AccountManagementRequests {
  accountManagementRequests: {
    documentSubmission?: DocumentSubmissionRequest
  }
}

export interface AccountDetails {
  account: IBKRAccount;
  associatedPersons: AssociatedPerson[];
  financialInformation: FinancialInformation;
  sourcesOfWealth: SourceOfWealth[];
  documents?: any[];
  marketData?: MarketData[];
  restrictions?: Restriction[];
  tradeBundles?: string[];
}

export interface IBKRAccount {
  accountId: string;
  masterAccountId: string;
  clearingStatus: string;
  clearingStatusDescription: string;
  stateCode: string;
  baseCurrency: string;
  dateBegun: string; // ISO date string
  accountTitle: string;
  emailAddress: string;
  margin: string;
  applicantType: string;
  subType: string;
  stockYieldProgram?: Record<string, unknown>; // empty object or future fields
  feeTemplate: FeeTemplate;
  capabilities: Capabilities;
  limitedOptionTrading: string;
  investmentObjectives: string[];
  externalId: string;
  mifidCategory: string;
  processType: string;
  equity?: number;
  riskScore?: number;
  dateApproved?: string;
  dateFunded?: string;
  dateOpened?: string;
}

export interface FeeTemplate {
  feeTemplateName?: string;
  feeEffectiveDate?: string;
  brokerFeeInfo?: string;
}

export interface Capabilities {
  approved: string[];
  requested: string[];
  activated: string[];
}

export interface AssociatedPerson {
  entityId: number;
  externalCode: string;
  firstName: string;
  lastName: string;
  username: string;
  passwordDate: string; // ISO datetime string
  userStatus: string;
  userStatusTrading: string;
  email: string;
  countryOfBirth: string;
  dateOfBirth: string; // ISO date string
  numberOfDependents: number;
  commercial: string;
  phones: Phones;
  residence: Address;
  mailing: Address;
  associations: string[];
  identityDocuments: IdentityDocument[];
  employmentType: string;
  employmentDetails?: EmploymentDetails;
}

export interface IdentityDocument {
  name: string;
  id: string;
  country: string;
}

export interface EmploymentDetails {
  Employer: string;
  Occupation: string;
  EmployerBusiness: string;
  EmployerAddress: Address;
  description?: string;
}

export interface Phones {
  mobile?: string;
  [key: string]: string | undefined;
}

export interface Address {
  street1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface FinancialInformation {
  currency: string;
  netWorth: string;
  liquidNetWorth: string;
  annualNetIncome: string;
  investmentExperience: Record<string, InvestmentExperience>;
}

export interface InvestmentExperience {
  knowledgeLevel: string;
  yearsTrading: string;
  tradesPerYear: string;
}

export interface SourceOfWealth {
  label: string;
  annual_percentage: number;
}

export interface MarketData {
  serviceId: string;
  serviceName: string;
  currency: string;
  monthlyFee: string;
}

export interface Restriction {
  id: number;
  name: string;
  byIB: boolean;
}

export interface FinancialRange {
  id: string;
  type: string;
  lowerBound: string;
  upperBound: string;
  ibEntity: string;
  startDate: string;
}

export interface FinancialRangesResponse {
  enumerationsType: string;
  jsonData: FinancialRange[];
}

export interface BusinessAndOccupation {
  employerBusiness: string;
  occupation: string;
}

export interface BusinessAndOccupationResponse {
  enumerationsType: string;
  jsonData: BusinessAndOccupation[];
}

export interface ProductCountryBundle {
  countryRegion: string;
  assetClass: string;
  bundleCode: string;
}

export interface ProductCountryBundlesResponse {
  enumerationsType: string;
  jsonData: ProductCountryBundle[];
}

export interface WireInstructions {
  enumerationType: string;
  jsonData: WireInstruction[];
}

export interface WireInstruction {
  accountNameAndBeneficiary: string;
  accountNumber: string;
  alternateAccountInfo: string;
  bankSWIFTCode: string;
  bankTitleAndAddress: string;
  currency: string;
  paymentReference: string;
  routingNumber: string;
  referenceNumber: string;
}

export type DepositInstructionPayload = z.infer<typeof deposit_instruction_schema>

export type DepositInstruction = DepositInstructionPayload & {
  accountId: string
  sendingInstitution: string
  identifier: string
  specialInstruction: string
  bankInstructionName: string
  senderInstitutionName: string
  isIRA: boolean
}

export type WithdrawalInstructionPayload = z.infer<typeof withdrawal_instruction_schema>

export type WithdrawalInstruction = WithdrawalInstructionPayload & {
  accountId: string
  bankInstructionName: string
}

export type UserRequest = {
  prefix: string;
  userName: string;
  externalId: string;
  authorizedTrader: boolean;
}

export type AccountScreening = {
  account_id: string;
  holder_name: string;
  ofac_results: string;
  fatf_status: string;
  risk_score: string;
} & Base

export type CLPCapabilityResponse = {
  name?: string
  data?: {
    addCLPCapability?: {
      accountId?: string
      message?: string
      requestId?: string
      status?: string
    }
    execution?: {
      client?: string
      clientMasterAccount?: string
      executedAt?: string
      processFile?: string
    }
  }
}
