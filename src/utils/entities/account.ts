import { accessAPI } from "../api"
import { Account } from "@/lib/entities/account"

export async function ReadAccountByAccountNumber(accountNumber: string): Promise<Account> {
    const response = await accessAPI('/database/read', 'POST', {
        'path': 'db/clients/accounts',
        'query': {'AccountNumber': accountNumber}
    })
    if (response['status'] !== 'success') throw new Error('Error fetching account')
    if (response['content'].length === 0) throw new Error('Account not found')
    if (response['content'].length > 1) throw new Error('Multiple accounts found')
    return response['content'][0]
}

export async function ReadAccounts(): Promise<Account[]> {
    const response = await accessAPI('/database/read', 'POST', {
        'path': 'db/clients/accounts',
        'query': {}
    })
    if (response['status'] !== 'success') throw new Error('Error fetching account')
    return response['content']
}

export async function CreateAccount(account: Account) {
    const response = await accessAPI('/database/create', 'POST', {
        'path': 'db/clients/accounts',
        'data': account
    })
    if (response['status'] !== 'success') throw new Error('Error creating account')
    return response['content']
}