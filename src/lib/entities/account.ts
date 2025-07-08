import { IBKRDocument, W8Ben } from "./application"
import { Base } from "./base"
import { z } from "zod"
import { account_schema } from "./schemas/account"

export type AccountPayload = z.infer<typeof account_schema>
export type InternalAccount = AccountPayload & {
  user_id: string,
  ibkr_account_number: string,
  ibkr_username: string | null,
  ibkr_password: string | null,
  temporal_email: string | null,
  temporal_password: string | null,
  application_id: string,
  fee_template: string | null,
}
export type Account = Base & InternalAccount


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

export interface W8BenSubmissionRequest {
  documents: IBKRDocument[]
  taxPayerDetails: TaxPayerDetails;
  inputLanguage: string;
  translation: boolean;
  accountId: string;
}

export interface TaxPayerDetails {
  w8ben: W8Ben;
  userName: string;
}

export interface AccountManagementRequests {
  accountManagementRequests: {
    documentSubmission?: DocumentSubmissionRequest
    updateW8Ben?: W8BenSubmissionRequest
  }
}