import { accessAPI } from "../api"
import { Contact, ContactPayload } from "@/lib/clients/contact"
import { IDResponse } from "@/lib/clients/base"
import { InternalDocument } from "@/lib/clients/documents"

export async function CreateContact(contact: ContactPayload): Promise<IDResponse> {
    const contactResponse: Contact = await accessAPI('/contacts/create', 'POST', { 'contact': contact })
    return contactResponse
}

export async function ReadContacts(): Promise<Contact[]> {
    const contacts: Contact[] = await accessAPI('/contacts/read', 'GET')
    return contacts
}

export async function ReadContactByID(id: string): Promise<Contact | null> {
    const contacts: Contact[] = await accessAPI(`/contacts/read?id=${id}`, 'GET')
    if (!contacts || contacts.length === 0) return null
    if (contacts.length > 1) throw new Error('Multiple contacts found with same ID')
    return contacts[0]
}

export async function ReadContactByEmail(email: string): Promise<Contact | null> {
    const contacts: Contact[] = await accessAPI(`/contacts/read?email=${email}`, 'GET')
    if (!contacts || contacts.length === 0) return null
    if (contacts.length > 1) throw new Error('Multiple contacts found with same Email')
    return contacts[0]
}

export async function UpdateContactByID(id: string, contact: Partial<Contact>): Promise<'Updated'> {
    await accessAPI('/contacts/update', 'POST', { 'query': { 'id': id }, 'contact': contact })
    return 'Updated'
}

export async function UploadContactDocument(
    accountID: string | null,
    contactID: string,
    file_name: string,
    file_length: number,
    sha1_checksum: string,
    mime_type: string,
    data: string,
    category: string,
    type: string,
    document_language: string,
    issued_date: string,
    expiry_date: string,
    comment: string | null = null
) {
    return accessAPI('/contacts/documents', 'POST', {
        account_id: accountID,
        contact_id: contactID,
        file_name,
        file_length,
        sha1_checksum,
        mime_type,
        data,
        category,
        type,
        document_language,
        issued_date,
        expiry_date,
        comment,
    })
}

export async function ReadContactDocuments(
    contactID?: string,
    options?: { includeData?: boolean; includeDocuments?: boolean; includeProcessing?: boolean; documentIds?: string[] }
): Promise<{documents: InternalDocument[], contact_documents: any[]}> {
    const includeData = options?.includeData ? 'true' : 'false'
    const includeDocuments = options?.includeDocuments === false ? 'false' : 'true'
    const includeProcessing = options?.includeProcessing ? 'true' : 'false'
    const params = new URLSearchParams({
        include_data: includeData,
        include_documents: includeDocuments,
        include_processing: includeProcessing,
    })
    if (contactID) params.set('contact_id', contactID)
    for (const documentId of options?.documentIds || []) {
        if (documentId) params.append('document_id', documentId)
    }
    return accessAPI(`/contacts/documents?${params.toString()}`, 'GET')
}

export async function UpdateContactDocument(
    documentID: string,
    category?: string,
    type?: string,
    document_language?: string,
    comment?: string,
    issued_date?: string,
    expiry_date?: string
): Promise<any> {
    return accessAPI('/contacts/documents', 'PATCH', {
        document_id: documentID,
        category,
        type,
        document_language,
        comment,
        issued_date,
        expiry_date,
    })
}

export async function DeleteContactDocument(documentID: string): Promise<any> {
    return accessAPI('/contacts/documents', 'DELETE', { document_id: documentID })
}

export async function CreateContactScreening(
    contactID: string
): Promise<IDResponse> {
    return accessAPI('/contacts/screening', 'POST', {
        contact_id: contactID
    })
}

export async function ReadContactScreenings(contactID: string): Promise<any[]> {
    return accessAPI(`/contacts/screening?contact_id=${contactID}`, 'GET')
}
