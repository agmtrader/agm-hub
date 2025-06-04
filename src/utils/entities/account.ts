import { Bucket, POADocumentInfo, POIDocumentInfo } from "@/lib/entities/document"
import { accessAPI } from "../api"
import { File as DocumentFile } from "@/lib/entities/document"
import { IndividualAccountApplicationInfo, AccountPayload, Account, RegistrationTasksResponse, PendingTasksResponse, DocumentSubmissionRequest } from "@/lib/entities/account"
import { Contact } from "@/lib/entities/contact"

export async function CreateAccount(account: AccountPayload): Promise<{id: string}> {
    let account_id = await accessAPI('/accounts/create', 'POST', {
        'account': account, 
    })
    return {'id': account_id}
}

export async function ReadAccounts() {
    let accounts:any = await accessAPI('/accounts/read', 'POST', {'query': {}})
    return accounts
}

export async function ReadAccountDetailsByAccountID(accountID:string): Promise<any | null> {
    let accounts:any = await accessAPI('/accounts/details', 'POST', {'account_id': accountID})
    return accounts || null
}

export async function ReadAccountByAccountID(accountID:string): Promise<Account | null> {
    let accounts:Account[] = await accessAPI('/accounts/read', 'POST', {'query': {'id': accountID}})
    return accounts[0] || null
}

export async function ReadAccountByUserID(userID:string): Promise<Account[] | null> {
    let accounts:Account[] = await accessAPI('/accounts/read', 'POST', {'query': {'user_id': userID}})
    return accounts
}

export async function ReadAccountByLeadID(leadID:string): Promise<Account | null> {
    let accounts:Account[] = await accessAPI('/accounts/read', 'POST', {'query': {'lead_id': leadID}})
    return accounts[0] || null
}

export async function ReadAccountInfoByID(accountID:string) {
    let accountInfo:IndividualAccountApplicationInfo = await accessAPI('/accounts/read_info', 'POST', {'account_id': accountID, 'query': {}})
    return accountInfo
}

export async function ReadAccountContactByID(accountID:string) {
    let accountContact:Contact = await accessAPI('/accounts/read_contact', 'POST', {'account_id': accountID, 'query': {}})
    return accountContact
}

export async function ReadAccountDocuments(accountID:string) {
    let documents:Bucket[] = await accessAPI('/accounts/read_documents', 'POST', {'account_id': accountID, 'query': {}})
    return documents
}

export async function UpdateAccountByID(accountID:string, accountInfo: AccountPayload) {
    const updatedID = await accessAPI('/accounts/update', 'POST', {'account_id': accountID, 'query': {}, 'account': accountInfo})
    return updatedID
}

export async function UpdateAccountInfoByID(accountID:string, accountInfo: IndividualAccountApplicationInfo) {
    const updatedID = await accessAPI('/accounts/update_info', 'POST', {'account_id': accountID, 'query': {}, 'account_info': accountInfo})
    return updatedID
}

export async function UploadAccountPOADocument(file: DocumentFile, documentInfo: POADocumentInfo, userID: string, accountID: string) {
    const poaID = await accessAPI('/accounts/upload_poa', 'POST', {'f': file, 'document_info': documentInfo, 'user_id': userID, 'account_id': accountID})
    return poaID
}

export async function UploadAccountPOIDocument(file: DocumentFile, documentInfo: POIDocumentInfo, userID: string, accountID: string) {
    const poiID = await accessAPI('/accounts/upload_poi', 'POST', {'f': file, 'document_info': documentInfo, 'user_id': userID, 'account_id': accountID})
    return poiID
}

export async function GetRegistrationTasksByAccountID(accountId: string): Promise<RegistrationTasksResponse | null> {
    try {
        const response: RegistrationTasksResponse = await accessAPI('/accounts/registration_tasks', 'POST', { 'account_id': accountId });
        return response;
    } catch (error) {
        console.error('Error fetching registration tasks:', error);
        return null;
    }
}

/**
 * Builds the documentSubmission payload for PATCH /api/v1/accounts/ using the first required pending document task.
 * The payload will have an empty documents array or an empty document object (payload left empty).
 * Returns null if no required document task is found.
 */
export function buildDocumentSubmissionRequest(pendingTasksData: PendingTasksResponse, accountId: string): DocumentSubmissionRequest | null {
  if (!pendingTasksData?.pendingTasks?.length) return null;
  const firstRequiredTask = pendingTasksData.pendingTasks.find((task) => task.requiredForApproval);
  if (!firstRequiredTask) return null;
  return {
    documentSubmission: {
      documents: [
        {
          signedBy: [],
          attachedFile: {
            fileName: '',
            fileLength: 0,
            sha1Checksum: ''
          },
          formNumber: firstRequiredTask.formNumber,
          validAddress: false,
          execLoginTimestamp: 0,
          execTimestamp: 0,
          payload: {
            mimeType: '',
            data: ''
          }
        }
      ],
      accountId,
      inputLanguage: 'en',
      translation: false,
    },
  };
}

export async function GetPendingTasksByAccountID(accountId: string): Promise<PendingTasksResponse | null> {
    try {
        const response: PendingTasksResponse = await accessAPI('/accounts/pending_tasks', 'POST', { 'account_id': accountId });
        return response;
    } catch (error) {
        console.error('Error fetching pending tasks:', error);
        return null;
    }
}