import { accessAPI } from "../api"

export async function ReadAccounts(): Promise<any[]> {
    const accounts = await accessAPI('/account_management/accounts', 'GET')
    return accounts
}

export async function ReadAccountDetailsByAccountNumber(accountNumber: string): Promise<any> {
    const account = await accessAPI(`/account_management/accounts/${accountNumber}`, 'GET')
    return account
}