import { ContactPayload, Contact } from "@/lib/entities/contact"
import { accessAPI } from "../api"

export async function CreateContact(contact:ContactPayload) {
    let contact_response = await accessAPI('/contacts/create', 'POST', {'contact': contact})
    return contact_response
}

export async function ReadContacts() {
    let contacts:Contact[] = await accessAPI('/contacts/read', 'POST', {'query': {}})
    return contacts  
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

export async function UpdateContactByID(id: string, contact: ContactPayload) {
    await accessAPI('/contacts/update', 'POST', {'query': {'id': id}, 'contact': contact})
    return 'Updated'
}

export async function DeleteContactByID(id: string) {
    let contact_response = await accessAPI('/contacts/delete', 'POST', {'query': {'id': id}})
    return contact_response
}

// ID functions
export async function ReadContactReferrerByID(id:string) {
    let contacts:Contact[] = await accessAPI('/contacts/read', 'POST', {'query': {'id': id}})
    if (contacts.length > 1) throw new Error('Multiple contacts found with same ID')
    if (contacts.length === 0) return null
    return contacts[0]
}