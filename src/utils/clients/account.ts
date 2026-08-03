import { accessAPI } from "../api"
import { Account, RegistrationTasksResponse, PendingTasksResponse, DocumentSubmissionRequest, AllForms, InternalAccount, AccountWritePayload, ProductCountryBundlesResponse, DepositInstruction, WithdrawalInstruction, AccountScreening, FinancialRangesResponse, BusinessAndOccupationResponse, ActiveBankInstructionsResponse, WithdrawableCashResponse, FinancialInformationUpdate, InvestmentExperience } from "@/lib/clients/account"
import { IDResponse } from "@/lib/clients/base"
import { InternalDocument, InternalDocumentPayload } from "@/lib/clients/documents"
import { Contact } from "@/lib/clients/contact"
import type { Application, IBKRDocument } from "@/lib/clients/application"
export type { Account } from '@/lib/clients/account';

export type AccountContactPayload = {
    account_id: string
    contact_id: string
    entity_id?: string | number | null
    external_id?: string | null
}

export async function LinkAccountContact(accountContact: AccountContactPayload): Promise<IDResponse> {
    return accessAPI('/accounts/contact', 'POST', { account_contact: accountContact })
}

export async function ReadAccountContacts(query?: {
    id?: string
    account_id?: string
    contact_id?: string
    entity_id?: string
}): Promise<any[]> {
    const params = new URLSearchParams()
    Object.entries(query || {}).forEach(([key, value]) => value && params.set(key, value))
    const queryString = params.toString()
    return accessAPI(queryString ? `/accounts/contacts?${queryString}` : '/accounts/contacts', 'GET')
}

export async function UpdateAccountContact(query: Record<string, string>, accountContact: Partial<AccountContactPayload>): Promise<any> {
    return accessAPI('/accounts/contact/update', 'POST', { query, account_contact: accountContact })
}

type IBKRApplicationSubmission = Application & {
    documents: IBKRDocument[]
}

let lastClientInstructionId = 0
function requireAccountId(accountID: string | null | undefined): string {
    if (!accountID) throw new Error('Account ID is required')
    return accountID
}

function generateClientInstructionId(): string {
    const now = Date.now()
    if (now <= lastClientInstructionId) {
        lastClientInstructionId += 1
    } else {
        lastClientInstructionId = now
    }
    return String(lastClientInstructionId)
}

// Database
export async function CreateAccount(account: AccountWritePayload): Promise<IDResponse> {
    const createResponse: IDResponse = await accessAPI('/accounts/create', 'POST', { 'account': account })
    return createResponse
}

export async function ReadAccounts() {
    let accounts:Account[] = await accessAPI('/accounts/read', 'GET')
    return accounts
}

export async function ReadAccountsWithMetadata() {
    const accountsWithMetadata = await accessAPI('/accounts/with_metadata', 'GET')
    return accountsWithMetadata
}

export async function ReadAccountByAccountID(accountID:string): Promise<Account | null> {
    let accounts:Account[] = await accessAPI(`/accounts/read?id=${accountID}`, 'GET')
    return accounts[0] || null
}

export async function ReadAccountContactsAndScreenings(accountID: string): Promise<{
    account_contacts: Array<{ id: string; account_id: string; contact_id: string; entity_id?: string | null; external_id?: string | null }>
    contacts: Contact[]
    screenings_by_contact_id: Record<string, any[]>
}> {
    return accessAPI(`/accounts/contacts_screenings_summary?account_id=${accountID}`, 'GET')
}

export async function ReadAccountsByAdvisorCode(advisorCode: string): Promise<Account[]> {
    let accounts:Account[] = await accessAPI(`/accounts/read?advisor_code=${advisorCode}`, 'GET')
    return accounts
}

export async function UpdateAccountByAccountID(accountID:string, account:Partial<AccountWritePayload>): Promise<Account[] | null> {
    const updateResponse: Account[] = await accessAPI(`/accounts/update`, 'POST', { 'query': { 'id': accountID }, 'account': account })
    return updateResponse
}

export async function SendAccountToIBKR(
    accountID: string,
    masterAccount: string,
    application: IBKRApplicationSubmission
) {
    if (
        !application ||
        !Array.isArray(application.documents) ||
        application.documents.length === 0 ||
        application.documents.some((document) => !document)
    ) {
        throw new Error('IBKR application payload must include documents')
    }

    const response: any = await accessAPI('/accounts/send_to_ibkr', 'POST', {
        account_id: accountID,
        master_account: masterAccount,
        application: {
            ...application,
            documents: application.documents,
        },
    })
    return response
}

export async function ReadAccountInstruction(accountID: string): Promise<any> {
    const response: any = await accessAPI(`/accounts/instructions?account_id=${accountID}`, 'GET')
    return response
}

export async function ReadAccountScreenings(accountID: string): Promise<AccountScreening[]> {
    const report: AccountScreening[] = (await accessAPI(`/accounts/screening?account_id=${accountID}`, 'GET'))
    return report
}

// Account Management
export async function ReadAccountDetailsByAccountID(accountID:string, masterAccount: string): Promise<any | null> {
    let accounts:any = await accessAPI(`/accounts/ibkr/details?account_id=${accountID}&master_account=${masterAccount}`, 'GET')
    return accounts || null
}

export async function GetPendingTasksByAccountID(accountId: string, masterAccount: string): Promise<PendingTasksResponse | null> {
    try {
        const response: PendingTasksResponse = await accessAPI(`/accounts/ibkr/pending_tasks?account_id=${accountId}&master_account=${masterAccount}`, 'GET');
        return response;
    } catch (error) {
        console.error('Error fetching pending tasks:', error);
        return null;
    }
}

export async function SubmitIBKRDocument(accountID: string, documentSubmission: DocumentSubmissionRequest, masterAccount: string) {
    const response = await accessAPI('/accounts/ibkr/documents', 'POST', { 'account_id': accountID, 'document_submission': documentSubmission, 'master_account': masterAccount })
    return response
}


export async function ApplyFeeTemplate(accountID: string, template_name: string, masterAccount: string): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/fee_template', 'POST', { 'account_id': accountID, 'template_name': template_name, 'master_account': masterAccount })
    return response
}

export async function ChangeFinancialInformation(
    accountID: string | null,
    newFinancialInformation: FinancialInformationUpdate,
    masterAccount: string
): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/change_financial_information', 'POST', {
        account_id: requireAccountId(accountID),
        master_account: masterAccount,
        new_financial_information: newFinancialInformation,
    })
    return response
}

export async function AddTradingPermissions(accountID: string | null, tradingPermissions: Array<{ country: string; product: string }>, masterAccount: string, documents?: any): Promise<any> {

    const payload: any = {
        account_id: requireAccountId(accountID),
        trading_permissions: tradingPermissions,
        master_account: masterAccount,
    }

    if (documents) payload.documents = documents

    const response: any = await accessAPI('/accounts/ibkr/trading_permissions', 'POST', payload)
    return response
}

export async function AddCLPCapability(accountID: string | null, masterAccount: string, documentSubmission: DocumentSubmissionRequest): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/clp_capability', 'POST', {
        'account_id': requireAccountId(accountID),
        'master_account': masterAccount,
        'document_submission': documentSubmission,
    })
    return response
}

export async function CreateDepositInstruction(masterAccount: string, instruction: DepositInstruction, accountID: string): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/deposit', 'POST', {
        master_account: masterAccount,
        instruction: instruction,
        account_id: accountID,
    })
    return response
}

export async function CreateWithdrawalInstruction(masterAccount: string, instruction: WithdrawalInstruction, accountID: string): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/withdraw', 'POST', {
        master_account: masterAccount,
        instruction: instruction,
        account_id: accountID,
    })
    return response
}

export async function GetWireInstructions(accountID: string | null, masterAccount: string, currency: string): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/wire_instructions', 'POST', {
        account_id: requireAccountId(accountID),
        master_account: masterAccount,
        currency: currency,
    })
    console.log(response)
    return response
}

export async function GetActiveBankInstructions(
    masterAccount: string,
    accountID: string | null,
    bankInstructionMethod: 'WIRE' | 'ACH' = 'WIRE',
    clientInstructionID: string = generateClientInstructionId()
): Promise<ActiveBankInstructionsResponse> {
    const response: ActiveBankInstructionsResponse = await accessAPI('/accounts/ibkr/active_bank_instructions', 'POST', {
        master_account: masterAccount,
        account_id: requireAccountId(accountID),
        client_instruction_id: clientInstructionID,
        bank_instruction_method: bankInstructionMethod,
    })
    return response
}

export async function GetWithdrawableCash(
    masterAccount: string,
    accountID: string | null,
    clientInstructionID: string = generateClientInstructionId()
): Promise<WithdrawableCashResponse> {
    const response: WithdrawableCashResponse = await accessAPI('/accounts/ibkr/withdrawable_cash', 'POST', {
        master_account: masterAccount,
        account_id: requireAccountId(accountID),
        client_instruction_id: clientInstructionID,
    })
    
    return response
}

export async function GetStatusOfInstruction(clientInstructionID: string): Promise<any> {
    const response: any = await accessAPI(`/accounts/ibkr/instructions?client_instruction_id=${clientInstructionID}`, 'GET')
    return response
}

// Enums
export async function GetForms(forms: string[]): Promise<AllForms> {
    const response: AllForms = await accessAPI('/accounts/ibkr/forms', 'POST', { 'forms': forms })
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

export async function GetAccountStatement(
    accountID: string | null,
    startDate: string,
    endDate: string,
    masterAccount: string,
    language: 'en' | 'es' = 'en'
): Promise<any> {
    const response: any = await accessAPI('/accounts/ibkr/statements', 'POST', {
        account_id: requireAccountId(accountID),
        start_date: startDate,
        end_date: endDate,
        master_account: masterAccount,
        language,
    })
    return response
}
