import { Bucket, POADocumentInfo, POIDocumentInfo } from "@/lib/entities/document"
import { accessAPI } from "../api"
import { File as DocumentFile } from "@/lib/entities/document"
import { IndividualTicket, Ticket, TicketPayload, TicketUI } from "@/lib/entities/ticket"

export async function CreateTicket(ticketPayload: TicketPayload, ticketInfoData: any): Promise<any> {
    let createdTicket: {ticket: Ticket, info: IndividualTicket} = await accessAPI('/tickets/create', 'POST', {
        'ticket': ticketPayload, 
        'info': ticketInfoData 
    })
    return createdTicket
}

export async function ReadTickets() {
    let tickets:Ticket[] = await accessAPI('/tickets/read', 'POST', {'query': {}})
    return tickets  
}

export async function ReadTicketByTicketID(ticketID:string) {
    let tickets:Ticket[] = await accessAPI('/tickets/read', 'POST', {'query': {'id': ticketID}})
    return tickets
}

export async function ReadTicketByUserID(userID:string) {
    let tickets:TicketUI[] = await accessAPI('/tickets/read', 'POST', {'query': {'user_id': userID}})
    return tickets
}

export async function ReadTicketInfoByID(ticketID:string) {
    let ticketInfo:IndividualTicket = await accessAPI('/tickets/read_info', 'POST', {'query': {'ticket_id': ticketID}})
    return ticketInfo
}

export async function ReadTicketDocuments(ticketID:string) {
    let documents:Bucket[] = await accessAPI('/tickets/read_documents', 'POST', {'ticket_id': ticketID, 'query': {}})
    return documents
}

export async function UpdateTicketInfoByID(ticketID:string, ticketInfo: IndividualTicket) {
    const updatedID = await accessAPI('/tickets/update_info', 'POST', {'query': {'ticket_id': ticketID}, 'ticket_info': ticketInfo})
    return updatedID
}

export async function UploadTicketPOADocument(file: DocumentFile, documentInfo: POADocumentInfo, userID: string, ticketID: string, ticketInfo: IndividualTicket) {
    const poaID = await accessAPI('/tickets/upload_poa', 'POST', {'f': file, 'document_info': documentInfo, 'user_id': userID, 'ticket_id': ticketID, 'ticket_info': ticketInfo})
    return poaID
}

export async function UploadTicketPOIDocument(file: DocumentFile, documentInfo: POIDocumentInfo, userID: string, ticketID: string, ticketInfo: IndividualTicket) {
    const poiID = await accessAPI('/tickets/upload_poi', 'POST', {'f': file, 'document_info': documentInfo, 'user_id': userID, 'ticket_id': ticketID, 'ticket_info': ticketInfo})
    return poiID
}