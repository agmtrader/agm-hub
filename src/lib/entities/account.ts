import { IBKRDocument } from "./application"
import { Base } from "./base"
import { z } from "zod"
import { account_schema } from "./schemas/account"

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
}
export type Account = Base & InternalAccount

// Internal Document Payload
export interface InternalDocumentPayload {
  mime_type: string;
  file_name: string;
  file_length: number;
  sha1_checksum: string;
  data: string;
}
export type InternalDocument = InternalDocumentPayload & Base

// Agreement/disclosure form details
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

// Registration Task
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

// Pending Task
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

// Documents Submitted for Pending or Registration Tasks
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

// IBKR Account Details
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
  // Newly added optional fields from IBKR API
  equity?: number;
  riskScore?: number;
  dateApproved?: string;
  dateFunded?: string;
  dateOpened?: string;
}

export interface FeeTemplate {
  feeTemplateName: string;
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