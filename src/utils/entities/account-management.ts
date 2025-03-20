import { accessAPI } from "../api"

export async function ReadAccounts(): Promise<any[]> {
    const accounts = await accessAPI('/account_management/accounts', 'GET')
    return accounts
}