import { accessAPI } from "../api"
import { AccountPayload, Account, RegistrationTasksResponse, PendingTasksResponse, DocumentSubmissionRequest, AllForms, AccountManagementRequests, W8BenSubmissionRequest, InternalAccount } from "@/lib/entities/account"
import { Contact } from "@/lib/entities/contact"
import { IDResponse } from "@/lib/entities/base"

export async function CreateAccount(account: InternalAccount): Promise<IDResponse> {
    const createResponse: IDResponse = await accessAPI('/accounts/create', 'POST', { 'account': account })
    return createResponse
}

export async function ReadAccounts() {
    let accounts:Account[] = await accessAPI('/accounts/read', 'POST', {'query': {}})
    return accounts
}

export async function ReadAccountByAccountID(accountID:string): Promise<Account | null> {
    let accounts:Account[] = await accessAPI('/accounts/read', 'POST', {'query': {'id': accountID}})
    return accounts[0] || null
}

export async function ReadAccountByUserID(userID:string): Promise<Account[] | null> {
    let accounts:Account[] = await accessAPI('/accounts/read', 'POST', {'query': {'user_id': userID}})
    return accounts
}

export async function ReadAccountInfoByID(accountID:string) {
    let accountInfo:any = await accessAPI('/accounts/read_info', 'POST', {'account_id': accountID, 'query': {}})
    return accountInfo
}

export async function ReadAccountByLeadID(leadID:string): Promise<Account | null> {
    let accounts:Account[] = await accessAPI('/accounts/read', 'POST', {'query': {'lead_id': leadID}})
    return accounts[0] || null
}

export async function ReadAccountContactByID(accountID:string) {
    let accountContact:Contact = await accessAPI('/accounts/read_contact', 'POST', {'account_id': accountID, 'query': {}})
    return accountContact
}

export async function ReadAccountByApplicationID(applicationID:string): Promise<Account[] | null> {
    let accounts:Account[] = await accessAPI('/accounts/read', 'POST', {'query': {'application_id': applicationID}})
    return accounts
}

export async function UpdateAccountByID(accountID:string, accountInfo: AccountPayload) {
    const updatedID = await accessAPI('/accounts/update', 'POST', {'account_id': accountID, 'query': {}, 'account': accountInfo})
    return updatedID
}

export async function UpdateAccountInfoByID(accountID:string, accountInfo: any) {
    const updatedID = await accessAPI('/accounts/update_info', 'POST', {'account_id': accountID, 'query': {}, 'account_info': accountInfo})
    return updatedID
}

export async function UploadAccountDocument(accountID:string, file_name:string, file_length:number, sha1_checksum:string, mime_type:string, data:string) {
    const updatedID = await accessAPI('/accounts/upload_document', 'POST', {
        'account_id': accountID,
        'query': {},
        'file_name': file_name,
        'file_length': file_length,
        'sha1_checksum': sha1_checksum,
        'mime_type': mime_type,
        'data': data
    })
    return updatedID
}

export async function ReadAccountDocuments(accountID:string): Promise<any> {
    const documents:any = await accessAPI('/accounts/read_documents', 'POST', {'account_id': accountID})
    return documents
}

// Account Management
export async function ReadAccountDetailsByAccountID(accountID:string): Promise<any | null> {
    let accounts:any = await accessAPI('/accounts/details', 'POST', {'account_id': accountID})
    return accounts || null
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

export async function GetForms(forms: string[]): Promise<AllForms> {
    const response: AllForms = await accessAPI('/accounts/forms', 'POST', { 'forms': forms })
    return response
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

export async function SubmitAccountDocument(accountID: string, documentSubmission: DocumentSubmissionRequest) {
    const accountManagementRequests: AccountManagementRequests = {
        accountManagementRequests: {
            documentSubmission
        }
    }
    console.log('accountManagementRequests:', accountManagementRequests)
    const response = await accessAPI('/accounts/update', 'POST', { 'account_id': accountID, 'account_management_requests': accountManagementRequests })
    return response
}

export async function SubmitAccountW8BenForm(accountID: string, updateW8Ben: W8BenSubmissionRequest) {
    const accountManagementRequests: AccountManagementRequests = {
        accountManagementRequests: {
            updateW8Ben
        }
    }
    console.log('accountManagementRequests:', accountManagementRequests)
    const response = await accessAPI('/accounts/update', 'POST', { 'account_id': accountID, 'account_management_requests': accountManagementRequests })
    return response
}