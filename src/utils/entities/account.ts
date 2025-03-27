import { accessAPI } from "../api"
import { Account } from "@/lib/entities/account"

export async function CreateAccount(account: Account) {
    if (!account['AccountID']) throw new Error('Account ID is required')
    const response = await accessAPI('/accounts/create', 'POST', {
        'data': account,
        'id': account['AccountID']
    })
    return response
}

export async function ReadAccounts(): Promise<Account[]> {
    const accounts = await accessAPI('/accounts/read', 'POST', {})
    return accounts
}

export async function ReadAccountByAccountNumber(accountNumber: string): Promise<Account | null> {
    const accounts = await accessAPI('/accounts/read', 'POST', {'query': {'AccountNumber': accountNumber}})
    if (accounts.length === 0) return null
    if (accounts.length > 1) throw new Error('Multiple accounts found')
    return accounts[0]
}


export async function ReadAccountByTicketID(ticketID:string):Promise<Account | null> {
    let accounts = await accessAPI('/accounts/read', 'POST', {'query': {'TicketID': ticketID}})
    if (accounts.length === 1) {
        return accounts[0]
    } else if (accounts.length > 1) {
        throw new Error('Multiple accounts found')
    } else {
        return null
    }
}