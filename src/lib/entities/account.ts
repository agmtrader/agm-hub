import { about_you_primary_schema, about_you_secondary_schema, general_info_schema, regulatory_schema } from "../schemas/account"
import { IBKRDocument } from "./application"
import { Base } from "./base"
import { z } from "zod"

export interface AccountPayload {
    advisor_id: string | null
    user_id: string
    lead_id: string | null
    master_account_id: string | null
    status: string
    account_type: string
    ibkr_account_number: string | null
}

export type Account = Base & AccountPayload

export type GeneralInfo = z.infer<ReturnType<typeof general_info_schema>>
export type AboutYouPrimary = z.infer<ReturnType<typeof about_you_primary_schema>>
export type AboutYouSecondary = z.infer<ReturnType<typeof about_you_secondary_schema>>
export type Regulatory = z.infer<ReturnType<typeof regulatory_schema>>

export type IndividualAccountApplicationInfo = GeneralInfo & AboutYouPrimary & Regulatory
export type JointAccountApplicationInfo = GeneralInfo & AboutYouPrimary & AboutYouSecondary & Regulatory

export interface DocumentSubmissionRequest {
  documentSubmission: {
    documents: IBKRDocument[];
    accountId: string;
    inputLanguage: string;
    translation: boolean;
  }
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