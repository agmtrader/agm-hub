export class ApiRequestError extends Error {
  constructor(message: string, public status?: number, public code?: string, public requestId?: string) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

export type ApiResult<T = any> =
  | { ok: true; data: T }
  | { ok: false; error: { message: string; status?: number; code?: string; requestId?: string } }

// Reconstruct after the Server Action returns; Next production never serializes a thrown message.
export function unwrapApiResult<T>(result: ApiResult<T>): T {
  if (result.ok) return result.data
  const { message, status, code, requestId } = result.error
  throw new ApiRequestError(message, status, code, requestId)
}
