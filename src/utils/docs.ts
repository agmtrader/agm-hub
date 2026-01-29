import { poa_schema, poe_schema, poi_schema } from "@/lib/entities/schemas/application"
import { z } from "zod"

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

export const applicationDocumentCategories: { [key: string]: number } = {
    'W8 Form': 5001,
    'Proof of Identity': 8001,
    'Proof of Address': 8002,
    'Source of Wealth': 9999,
}

export const poaTypes = (poa_schema.shape.type as z.ZodEnum<["Utility Bill", "Bank Statement", "Tax Return", "Marriage Certificate", "Other"]>).options
export const poiTypes = (poi_schema.shape.type as z.ZodEnum<["National ID Card", "Driver License", "Passport", "Other"]>).options
export const poeTypes = (poe_schema.shape.type as z.ZodEnum<["Business Registration", "Articles of Incorporation", "Company Charter", "Partnership Agreement", "Government-issued business license", "Government-issued Certificate of Good Standing from the Jurisdiction of Incorporation", "Business Registration", "Regulatory Registration License", "Other"]>).options
export const documentCategories = [
  'Proof of Identity',
  'Proof of Address',
  'Proof of Existence',
  'Source of Wealth',
  'Manifest',
  'New Application Form',
  "Tax",
  'Other'
] as const
