import { InternalDocument } from '@/lib/clients/documents'
import { accessAPI } from '../api'

export type AccountDocument = {
  account_id: string
  document_id: string
  category?: string
  type?: string
  name?: string
  issued_date?: string
  expiry_date?: string
  comment?: string | null
}

export async function ReadDocuments(): Promise<{ documents: InternalDocument[]; account_documents: AccountDocument[] }> {
  const response: { documents: InternalDocument[]; account_documents: AccountDocument[] } = await accessAPI(
    '/documents/read',
    'GET'
  )
  return response
}

export function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer
          const bytes = new Uint8Array(arrayBuffer)
          let binary = ''
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          const base64 = btoa(binary)
          resolve(base64)
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = error => reject(error)
      reader.readAsArrayBuffer(file)
    })
}

export async function calculateSHA1(file: File): Promise<string> {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
}
