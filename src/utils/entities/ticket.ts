import { accessAPI } from "../api"
import { Ticket } from "@/lib/entities/ticket"
import { addColumnsFromJSON } from "../table"

export async function ReadTickets() {
    let tickets:Ticket[] = await accessAPI('/database/read', 'POST', {'path': 'db/clients/tickets'})
    tickets = await addColumnsFromJSON(tickets)
    return tickets.sort((a, b) => (b.TicketID.toString().localeCompare(a.TicketID.toString())))
    
}

export async function UpdateTicketByID(ticketID:string, data:any) {
    await accessAPI('/database/update', 'POST', {'path': `db/clients/tickets`, 'query': {'TicketID': ticketID}, 'data': data})
    return 'Updated'
}

export async function CreateTicket(ticket:Ticket, id:string) {
    let ticket_response = await accessAPI('/database/create', 'POST', {'path': `db/clients/tickets`, 'data': ticket, 'id': id})
    return ticket_response
}