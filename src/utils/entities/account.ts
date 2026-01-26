import { accessAPI } from "../api"
import { Account, RegistrationTasksResponse, PendingTasksResponse, DocumentSubmissionRequest, AllForms, AccountManagementRequests, InternalAccount, InternalDocument, InternalDocumentPayload, ProductCountryBundlesResponse, DepositInstruction, WithdrawalInstruction, AccountScreening, FinancialRangesResponse, BusinessAndOccupationResponse } from "@/lib/entities/account"
import { InvestmentExperience } from "@/lib/entities/application"
import { IDResponse } from "@/lib/entities/base"
import { SecurityQuestionsResponse } from "@/lib/entities/security_question"

export type { Account } from '@/lib/entities/account';

// Database
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

export async function UpdateAccountByAccountID(accountID:string, account:Partial<InternalAccount>): Promise<Account[] | null> {
    const updateResponse: Account[] = await accessAPI(`/accounts/update`, 'POST', { 'query': { 'id': accountID }, 'account': account })
    return updateResponse
}

export async function UploadAccountDocument(accountID:string, file_name:string, file_length:number, sha1_checksum:string, mime_type:string, data:string, category:string, type:string, issued_date:string, expiry_date:string, name:string, comment:string | null) {
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
        'data': document.data,
        'category': category,
        'type': type,
        'issued_date': issued_date,
        'expiry_date': expiry_date,
        'name': name,
        'comment': comment,
    })
    console.log(uploadResponse)
    return uploadResponse
}

export async function ReadAccountDocuments(accountID:string): Promise<{documents: InternalDocument[], account_documents: any[]}> {
    const response: {documents: InternalDocument[], account_documents: any[]} = await accessAPI(`/accounts/documents?account_id=${accountID}`, 'GET')
    return response
}

export async function DeleteAccountDocument(documentID:string): Promise<any> {
    const response: any = await accessAPI(`/accounts/documents`, 'DELETE', { 'document_id': documentID })
    return response
}

export async function UpdateAccountDocument(documentID: string, category?: string, type?: string, name?: string, comment?: string, issued_date?: string, expiry_date?: string): Promise<any> {
    const response: any = await accessAPI(`/accounts/documents`, 'PATCH', {
        'document_id': documentID,
        'category': category,
        'type': type,
        'name': name,
        'comment': comment,
        'issued_date': issued_date,
        'expiry_date': expiry_date,
    })
    return response
}

export async function ReadAccountInstruction(accountID: string): Promise<any> {
    const response: any = await accessAPI(`/accounts/instructions?account_id=${accountID}`, 'GET')
    return response
}

export async function ScreenPerson(accountID: string, holderName: string, residenceCountry: string): Promise<IDResponse> {
    const response: IDResponse = await accessAPI('/accounts/screening', 'POST', { account_id: accountID, holder_name: holderName, residence_country: residenceCountry })
    return response
}

export async function ReadAccountScreenings(accountID: string): Promise<AccountScreening[]> {
    const report: AccountScreening[] = (await accessAPI(`/accounts/screening?account_id=${accountID}`, 'GET'))
    return report
}

// Account Management
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

export async function SubmitIBKRDocument(accountID: string, documentSubmission: DocumentSubmissionRequest, masterAccount: 'ad' | 'br') {
    const response = await accessAPI('/accounts/ibkr/documents', 'POST', { 'account_id': accountID, 'document_submission': documentSubmission, 'master_account': masterAccount })
    return response
}


export async function CreateUserForAccount(accountID: string, prefix:string, userName:string, externalId:string, authorizedTrader:boolean, masterAccount: 'ad' | 'br'): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/user', 'POST', {
        'account_id': accountID,
        'prefix': prefix,
        'user_name': userName,
        'external_id': externalId,
        'authorized_trader': authorizedTrader,
        'master_account': masterAccount,
    })
    return response
}

export async function ApplyFeeTemplate(accountID: string, template_name: string, masterAccount: 'ad' | 'br'): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/fee_template', 'POST', { 'account_id': accountID, 'template_name': template_name, 'master_account': masterAccount })
    return response
}

export async function ChangeInvestmentExperience(accountID: string, investmentExperience: InvestmentExperience[], masterAccount: 'ad' | 'br'): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/change_investment_experience', 'POST', { account_id: accountID, investment_experience: investmentExperience, master_account: masterAccount })
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

export async function TransferPositionInternally(masterAccount: 'ad' | 'br', sourceAccountID: string, targetAccountID: string, transferQuantity: number, conid: string): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/transfer_position_internally', 'POST', {
        source_account_id: sourceAccountID,
        target_account_id: targetAccountID,
        transfer_quantity: transferQuantity,
        conid: conid,
        master_account: masterAccount,
    })
    return response
}

export async function TransferPositionExternally(masterAccount: 'ad' | 'br', sourceAccountID: string, targetAccountID: string, transferQuantity: number, conid: string): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/transfer_position_externally', 'POST', {
        master_account: masterAccount,
        source_account_id: sourceAccountID,
        target_account_id: targetAccountID,
        conid: conid,
        transfer_quantity: transferQuantity,
    })
    return response
}

export async function CreateDepositInstruction(masterAccount: 'ad' | 'br', instruction: DepositInstruction, accountID: string): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/deposit', 'POST', {
        master_account: masterAccount,
        instruction: instruction,
        account_id: accountID,
    })
    return response
}

export async function CreateWithdrawalInstruction(masterAccount: 'ad' | 'br', instruction: WithdrawalInstruction, accountID: string): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/withdraw', 'POST', {
        master_account: masterAccount,
        instruction: instruction,
        account_id: accountID,
    })
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

export async function GetFinancialRanges(): Promise<FinancialRangesResponse> {
  const response: FinancialRangesResponse = await accessAPI(`/accounts/ibkr/financial_ranges`, 'GET')
  return response
}

export async function GetBusinessAndOccupation(): Promise<BusinessAndOccupationResponse> {
  const response: BusinessAndOccupationResponse = await accessAPI(`/accounts/ibkr/business_and_occupation`, 'GET')
  return response
}