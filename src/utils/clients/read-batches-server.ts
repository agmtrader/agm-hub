"use server"
import { ApiRequestError } from '../api-result'
import { GetFinancialRanges, GetBusinessAndOccupation, GetForms, ReadAccountContacts } from './account'
import { ReadContactByID } from './contact'
import { ReadRiskProfileById, ListRiskArchetypes } from './risk-profile'

async function capture<T>(read: () => Promise<T>) {
  try { return { ok: true as const, data: await read() } }
  catch (error) {
    if (!(error instanceof ApiRequestError)) throw error
    return { ok: false as const, error: { message: error.message, status: error.status, code: error.code, requestId: error.requestId } }
  }
}

// Fixed resource batches preserve existing API scope checks and never accept URLs/methods.
export async function ApplicationReferencesResult(forms: string[]) {
  return capture(async () => {
    const [financialRangesResult, businessResult, agreementsResult] = await Promise.all([
      GetFinancialRanges(), GetBusinessAndOccupation(), GetForms(forms),
    ])
    return { financialRangesResult, businessResult, agreementsResult }
  })
}

export async function ApplicationDocumentHoldersResult(accountId: string) {
  return capture(async () => {
    const links = await ReadAccountContacts({ account_id: accountId })
    const ids = [...new Set(links.map(link => String(link.contact_id || '').trim()).filter(Boolean))]
    const contacts = await Promise.all(ids.map(id => ReadContactByID(id)))
    return contacts.filter(contact => Boolean(contact?.id)).map(contact => ({
      id: String(contact!.id), name: contact!.company_name || contact!.name || contact!.email || String(contact!.id),
    }))
  })
}

export async function ProposalRiskContextResult(profileId: string) {
  return capture(async () => {
    const [profile, archetypes] = await Promise.all([ReadRiskProfileById(profileId), ListRiskArchetypes()])
    return { profile: profile ? { score: profile.score } : null, archetypes }
  })
}
