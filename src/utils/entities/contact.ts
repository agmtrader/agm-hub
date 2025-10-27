import { accessAPI } from "../api"
import { Contact, ContactPayload } from "@/lib/entities/contact"
import { IDResponse } from "@/lib/entities/base"

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