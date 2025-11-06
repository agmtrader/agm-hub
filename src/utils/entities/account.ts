import { accessAPI } from "../api"
import { Account, RegistrationTasksResponse, PendingTasksResponse, DocumentSubmissionRequest, AllForms, AccountManagementRequests, InternalAccount, InternalDocument, InternalDocumentPayload, ProductCountryBundlesResponse } from "@/lib/entities/account"
import { FinancialInformation, InvestmentExperience } from "@/lib/entities/application"
import { IDResponse } from "@/lib/entities/base"
import { SecurityQuestionsResponse } from "@/lib/entities/security_question"

// Database
export async function CreateAccount(account: InternalAccount): Promise<IDResponse> {
    const createResponse: IDResponse = await accessAPI('/accounts/create', 'POST', { 'account': account })
    return createResponse
}

export async function CreateAccountInstruction(accountID: string): Promise<any> {
    const response: any = await accessAPI(`/accounts/instructions`, 'POST', { 'account_id': accountID })
    return response
}

export async function ReadAccounts() {
    let accounts:Account[] = await accessAPI('/accounts/read', 'GET')
    return accounts
}

export async function ReadAccountInstruction(accountID: string): Promise<any> {
    const response: any = await accessAPI(`/accounts/instructions?account_id=${accountID}`, 'GET')
    return response
}

export async function ReadAccountByAccountID(accountID:string): Promise<Account | null> {
    let accounts:Account[] = await accessAPI(`/accounts/read?id=${accountID}`, 'GET')
    return accounts[0] || null
}

export async function ReadAccountByUserID(userID:string): Promise<Account[] | null> {
    let accounts:Account[] = await accessAPI(`/accounts/read?user_id=${userID}`, 'GET')
    return accounts
}

export async function UpdateAccountByAccountID(accountID:string, account:Partial<InternalAccount>): Promise<Account[] | null> {
    const updateResponse: Account[] = await accessAPI(`/accounts/update`, 'POST', { 'query': { 'id': accountID }, 'account': account })
    return updateResponse
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
export async function SubmitIBKRDocument(accountID: string, documentSubmission: DocumentSubmissionRequest, masterAccount: 'ad' | 'br') {
    const response = await accessAPI('/accounts/ibkr/documents', 'POST', { 'account_id': accountID, 'document_submission': documentSubmission, 'master_account': masterAccount })
    return response
}

export async function ReadAccountDetailsByAccountID(accountID:string, masterAccount: 'ad' | 'br'): Promise<any | null> {
    let accounts:any = await accessAPI(`/accounts/ibkr/details?account_id=${accountID}&master_account=${masterAccount}`, 'GET')
    return accounts || null
}

export async function GetRegistrationTasksByAccountID(accountId: string, masterAccount: 'ad' | 'br'): Promise<RegistrationTasksResponse | null> {
    try {
        const response: RegistrationTasksResponse = await accessAPI(`/accounts/ibkr/registration_tasks?account_id=${accountId}&master_account=${masterAccount}`, 'GET');
        return response;
    } catch (error) {
        console.error('Error fetching registration tasks:', error);
        return null;
    }
}

export async function GetPendingTasksByAccountID(accountId: string, masterAccount: 'ad' | 'br'): Promise<PendingTasksResponse | null> {
    try {
        const response: PendingTasksResponse = await accessAPI(`/accounts/ibkr/pending_tasks?account_id=${accountId}&master_account=${masterAccount}`, 'GET');
        return response;
    } catch (error) {
        console.error('Error fetching pending tasks:', error);
        return null;
    }
}

export async function ApplyFeeTemplate(accountID: string, template_name: string, masterAccount: 'ad' | 'br'): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/fee_template', 'POST', { 'account_id': accountID, 'template_name': template_name, 'master_account': masterAccount })
    return response
}

export async function AddTradingPermissions(accountID: string, tradingPermissions: Array<{ country: string; product: string }>, masterAccount: 'ad' | 'br', documents?: any): Promise<any> {

    const payload: any = {
        account_id: accountID,
        trading_permissions: tradingPermissions,
        master_account: masterAccount,
    }

    if (documents) payload.documents = documents

    const response: any = await accessAPI('/accounts/ibkr/trading_permissions', 'POST', payload)
    return response
}

export async function AddCLPCapability(accountID: string, masterAccount: 'ad' | 'br', documentSubmission: DocumentSubmissionRequest): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/clp_capability', 'POST', {
        'account_id': accountID,
        'master_account': masterAccount,
        'document_submission': documentSubmission,
    })
    return response
}

export async function UpdateAccountEmail(referenceUserName: string, newEmail: string, masterAccount: 'ad' | 'br', access = true): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/account_email', 'POST', {
        'reference_user_name': referenceUserName,
        'new_email': newEmail,
        'access': access,
        'master_account': masterAccount,
    })
    return response
}

export async function GetWithdrawableCash(accountID: string, masterAccount: 'ad' | 'br', clientInstructionID: string): Promise<any> {
    const response: any = await accessAPI(`/accounts/ibkr/withdrawable_cash?account_id=${accountID}&master_account=${masterAccount}&client_instruction_id=${clientInstructionID}`, 'GET')
    return response
}

export async function GetActiveBankInstructions(accountID: string, masterAccount: 'ad' | 'br', clientInstructionID: string, bankInstructionMethod: 'ACH' | 'WIRE'): Promise<any> {
    const response: any = await accessAPI(`/accounts/ibkr/bank_instructions?account_id=${accountID}&master_account=${masterAccount}&client_instruction_id=${clientInstructionID}&bank_instruction_method=${bankInstructionMethod}`, 'GET')
    return response
}

export async function GetStatusOfInstruction(clientInstructionID: string): Promise<any> {
    const response: any = await accessAPI(`/accounts/ibkr/instructions?client_instruction_id=${clientInstructionID}`, 'GET')
    return response
}

// Enums
export async function GetForms(forms: string[], masterAccount: 'ad' | 'br'): Promise<AllForms> {
    const response: AllForms = await accessAPI('/accounts/ibkr/forms', 'POST', { 'forms': forms, 'master_account': masterAccount })
    return response
}

export async function GetSecurityQuestions(): Promise<SecurityQuestionsResponse> {
    const response: SecurityQuestionsResponse = await accessAPI(`/accounts/ibkr/security_questions`, 'GET')
    return response
}

export async function GetProductCountryBundles(): Promise<ProductCountryBundlesResponse> {
    const response: ProductCountryBundlesResponse = await accessAPI(`/accounts/ibkr/product_country_bundles`, 'GET')
    return response
}

export async function CreateDepositInstruction(deposit: import('@/lib/entities/account').DepositRequest): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/deposit', 'POST', deposit)
    return response
}

export async function GetWireInstructions(accountID: string, masterAccount: 'ad' | 'br', currency: string): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/wire_instructions', 'POST', {
        account_id: accountID,
        master_account: masterAccount,
        currency: currency,
    })
    return response
}

export async function ChangeFinancialInformation(accountID: string, investmentExperience: InvestmentExperience[], masterAccount: 'ad' | 'br'): Promise<any> {

    const response: any = await accessAPI('/accounts/ibkr/change_financial_information', 'POST', { account_id: accountID, investment_experience: investmentExperience, master_account: masterAccount })
    return response
    
}