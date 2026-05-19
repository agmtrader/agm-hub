import { accessAPI } from "../api"
import { IDResponse } from "@/lib/clients/base"

export type AccountContactPayload = {
  account_id: string
  contact_id: string
  entity_id?: string | number | null
  external_id?: string | null
}

export async function CreateAccountContact(accountContact: AccountContactPayload): Promise<IDResponse> {
  return accessAPI('/account_contacts/create', 'POST', { account_contact: accountContact })
}

export async function ReadAccountContacts(query?: {
  id?: string
  account_id?: string
  contact_id?: string
  entity_id?: string
}): Promise<Array<{ id: string; account_id: string; contact_id: string; entity_id?: string | null; external_id?: string | null }>> {
  const params = new URLSearchParams()
  if (query?.id) params.set('id', query.id)
  if (query?.account_id) params.set('account_id', query.account_id)
  if (query?.contact_id) params.set('contact_id', query.contact_id)
  if (query?.entity_id) params.set('entity_id', query.entity_id)
  const queryString = params.toString()
  const path = queryString ? `/account_contacts/read?${queryString}` : '/account_contacts/read'
  return accessAPI(path, 'GET')
}

export async function UpdateAccountContact(
  query: Record<string, unknown>,
  accountContact: Partial<AccountContactPayload>
): Promise<{ status: string }> {
  return accessAPI('/account_contacts/update', 'POST', {
    query,
    account_contact: accountContact,
  })
}

export async function DeleteAccountContact(query: Record<string, unknown>): Promise<{ status: string }> {
  return accessAPI('/account_contacts/delete', 'POST', { query })
}
