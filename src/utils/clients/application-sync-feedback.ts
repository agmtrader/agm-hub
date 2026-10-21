import { ApiRequestError } from '../api-result'

export type ApplicationSyncOperation = 'contacts_and_links' | 'screenings' | 'documents'
export type ApplicationSyncFailure = {
  kind: 'invalid' | 'review' | 'support' | 'temporary' | 'documents' | 'screenings'
  requestId?: string
}

// Use controlled copy rather than exposing upstream messages or identity data.
export function applicationSyncFailure(error: unknown, operation: ApplicationSyncOperation): ApplicationSyncFailure {
  const apiError = error instanceof ApiRequestError ? error : undefined
  const requestId = apiError?.requestId && /^[A-Za-z0-9_-]{1,128}$/.test(apiError.requestId)
    ? apiError.requestId : undefined
  let kind: ApplicationSyncFailure['kind'] = 'temporary'
  if (apiError?.status === 401 || apiError?.status === 403) kind = 'support'
  else if (operation === 'documents' || operation === 'screenings') kind = operation
  else if (apiError?.code === 'contact_identity_invalid') kind = 'invalid'
  else if (['contact_identity_conflict', 'contact_identity_ambiguous', 'contact_identity_insufficient'].includes(apiError?.code || '')) kind = 'review'
  else if (['contact_identity_account_missing', 'contact_identity_not_pending'].includes(apiError?.code || '')) kind = 'support'
  return { kind, ...(requestId ? { requestId } : {}) }
}

export class ApplicationSyncError extends Error {
  constructor(public failure: ApplicationSyncFailure) {
    super('Application setup needs attention.')
    this.name = 'ApplicationSyncError'
  }
}

export function canRetryApplicationSync(failure: ApplicationSyncFailure): boolean {
  return ['temporary', 'documents', 'screenings'].includes(failure.kind)
}
