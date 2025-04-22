import { Contact } from "@/lib/entities/contact"
import { accessAPI } from "../api"

export async function CreateContact(contact:Contact) {
    let contact_response = await accessAPI('/contacts/create', 'POST', {'data': contact, 'id': contact.ContactID})
    return contact_response
}

export async function ReadContacts() {
    let contacts:Contact[] = await accessAPI('/contacts/read', 'POST', {})
    return contacts.sort((a, b) => (b.ContactID.toString().localeCompare(a.ContactID.toString())))   
}

export async function ReadContactByID(id:string) {
    let contacts:Contact[] = await accessAPI('/contacts/read', 'POST', {'query': {'id': id}})
    if (contacts.length > 1) throw new Error('Multiple contacts found with same ID')
    if (contacts.length === 0) return null
    return contacts[0]
}

export async function ReadContactByEmail(email: string) {
    const contacts = await accessAPI('/contacts/read', 'POST', {'query': {'email': email}})
    if (contacts.length === 0) return null
    if (contacts.length > 1) throw new Error('Multiple contacts found')
    return contacts[0]
}

export async function UpdateContact(contact: Contact) {
    let contact_response = await accessAPI('/contacts/update', 'POST', {'data': contact})
    return contact_response
}

export async function DeleteContact(id: string) {
    let contact_response = await accessAPI('/contacts/delete', 'POST', {'data': {'id': id}})
    return contact_response
}

export async function UpdateContactByID(contactID: string, data: any) {
    await accessAPI('/contacts/update', 'POST', {'query': {'ContactID': contactID}, 'data': data})
    return 'Updated'
}