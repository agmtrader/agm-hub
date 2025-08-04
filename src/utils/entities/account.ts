import { accessAPI } from "../api"
import { Account, RegistrationTasksResponse, PendingTasksResponse, DocumentSubmissionRequest, AllForms, AccountManagementRequests, InternalAccount, InternalDocument, InternalDocumentPayload } from "@/lib/entities/account"
import { IDResponse } from "@/lib/entities/base"

export async function CreateAccount(account: InternalAccount): Promise<IDResponse> {
    const createResponse: IDResponse = await accessAPI('/accounts/create', 'POST', { 'account': account })
    return createResponse
}

export async function ReadAccounts() {
    let accounts:Account[] = await accessAPI('/accounts/read', 'GET')
    return accounts
}   

export async function ReadAccountByAccountID(accountID:string): Promise<Account | null> {
    let accounts:Account[] = await accessAPI(`/accounts/read?id=${accountID}`, 'GET')
    return accounts[0] || null
}

export async function ReadAccountByUserID(userID:string): Promise<Account[] | null> {
    let accounts:Account[] = await accessAPI(`/accounts/read?user_id=${userID}`, 'GET')
    return accounts
}

export async function UploadAccountDocument(accountID:string, file_name:string, file_length:number, sha1_checksum:string, mime_type:string, data:string) {
    const document:InternalDocumentPayload = {
        file_name: file_name,
        file_length: file_length,
        sha1_checksum: sha1_checksum,
        mime_type: mime_type,
        data: data
    }
    const uploadResponse = await accessAPI('/accounts/documents', 'POST', {
        'account_id': accountID,
        'file_name': document.file_name,
        'file_length': document.file_length,
        'sha1_checksum': document.sha1_checksum,
        'mime_type': document.mime_type,
        'data': document.data
    })
    return uploadResponse
}

export async function ReadAccountDocuments(accountID:string): Promise<InternalDocument[]> {
    const documents:InternalDocument[] = await accessAPI(`/accounts/documents?account_id=${accountID}`, 'GET')
    return documents
}

// Account Management
export async function ReadAccountDetailsByAccountID(accountID:string): Promise<any | null> {
    let accounts:any = await accessAPI(`/accounts/ibkr/details?account_id=${accountID}`, 'GET')
    return accounts || null
}

export async function GetRegistrationTasksByAccountID(accountId: string): Promise<RegistrationTasksResponse | null> {
    try {
        const response: RegistrationTasksResponse = await accessAPI(`/accounts/ibkr/registration_tasks?account_id=${accountId}`, 'GET');
        return response;
    } catch (error) {
        console.error('Error fetching registration tasks:', error);
        return null;
    }
}

export async function GetPendingTasksByAccountID(accountId: string): Promise<PendingTasksResponse | null> {
    try {
        const response: PendingTasksResponse = await accessAPI(`/accounts/ibkr/pending_tasks?account_id=${accountId}`, 'GET');
        return response;
    } catch (error) {
        console.error('Error fetching pending tasks:', error);
        return null;
    }
}

export async function GetForms(forms: string[]): Promise<AllForms> {
    const response: AllForms = await accessAPI('/accounts/ibkr/forms', 'POST', { 'forms': forms })
    return response
}

export async function SubmitIBKRDocument(accountID: string, documentSubmission: DocumentSubmissionRequest) {
    const accountManagementRequests: AccountManagementRequests = {
        accountManagementRequests: {
            documentSubmission
        }
    }
    const response = await accessAPI('/accounts/ibkr/update', 'POST', { 'account_id': accountID, 'account_management_requests': accountManagementRequests })
    return response
}