import { accessAPI } from "../api"
import { Ticket } from "@/lib/entities/ticket"

export async function CreateTicket(ticket:Ticket, id:string) {
    let ticket_response = await accessAPI('/tickets/create', 'POST', {'data': ticket, 'id': id})
    return ticket_response
}

export async function ReadTickets() {
    let tickets:Ticket[] = await accessAPI('/tickets/read', 'POST', {'query': {}})
    return tickets.sort((a, b) => (b.TicketID.toString().localeCompare(a.TicketID.toString())))   
}

export async function ReadTicketByTicketID(ticketID:string) {
    let tickets:Ticket[] = await accessAPI('/tickets/read', 'POST', {'query': {'TicketID': ticketID}})
    return tickets.sort((a, b) => (b.TicketID.toString().localeCompare(a.TicketID.toString())))
}

export async function ReadTicketByUserID(userID:string) {
    let tickets:Ticket[] = await accessAPI('/tickets/read', 'POST', {'query': {'UserID': userID}})
    return tickets.sort((a, b) => (b.TicketID.toString().localeCompare(a.TicketID.toString())))
}

export async function UpdateTicketByID(ticketID:string, data:any) {
    await accessAPI('/tickets/update', 'POST', {'query': {'TicketID': ticketID}, 'data': data})
    return 'Updated'
}