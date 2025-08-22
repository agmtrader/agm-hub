import { EmailChange, EmailChangePayload } from "@/lib/entities/email_change"
import { IDResponse } from "@/lib/entities/base"
import { accessAPI } from "../api"

export async function CreateEmailChange(emailChange: EmailChangePayload): Promise<IDResponse> {
  const createResponse: IDResponse = await accessAPI('/email_change/create', 'POST', { 'email_change': emailChange })
  return createResponse
}

export async function ReadEmailChanges(): Promise<EmailChange[]> {
  const emailChanges: EmailChange[] = await accessAPI('/email_change/read', 'GET')
  return emailChanges
}

export async function ReadEmailChangeByID(id: string): Promise<EmailChange | null> {
  const emailChanges: EmailChange[] = await accessAPI(`/email_change/read?id=${id}`, 'GET')
  if (!emailChanges || emailChanges.length === 0) return null
  if (emailChanges.length > 1) throw new Error('Multiple EmailChange records found with same ID')
  return emailChanges[0]
}

export async function UpdateEmailChangeByID(id: string, emailChange: Partial<EmailChangePayload>): Promise<IDResponse> {
  const updateResponse: IDResponse = await accessAPI('/email_change/update', 'POST', { 'query': { 'id': id }, 'email_change': emailChange })
  return updateResponse
}

export async function DeleteEmailChangeByID(id: string): Promise<IDResponse> {
  const deleteResponse: IDResponse = await accessAPI('/email_change/delete', 'POST', { 'query': { 'id': id } })
  return deleteResponse
}
