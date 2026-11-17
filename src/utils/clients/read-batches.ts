import { unwrapApiResult } from '../api-result'
import { ApplicationReferencesResult, ApplicationDocumentHoldersResult, ProposalRiskContextResult } from './read-batches-server'
const pendingReferences = new Map<string, Promise<Awaited<ReturnType<typeof ApplicationReferencesResult>>>>()
export async function ReadApplicationReferences(forms: string[]) {
  const key = JSON.stringify(forms)
  let pending = pendingReferences.get(key)
  if (!pending) {
    pending = ApplicationReferencesResult(forms)
    pendingReferences.set(key, pending)
    const current = pending
    void pending.then(() => { if (pendingReferences.get(key) === current) pendingReferences.delete(key) }, () => { if (pendingReferences.get(key) === current) pendingReferences.delete(key) })
  }
  return unwrapApiResult(await pending)
}
export async function ReadApplicationDocumentHolders(accountId: string) { return unwrapApiResult(await ApplicationDocumentHoldersResult(accountId)) }
export async function ReadProposalRiskContext(profileId: string) { return unwrapApiResult(await ProposalRiskContextResult(profileId)) }
