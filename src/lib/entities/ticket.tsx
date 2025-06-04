import { about_you_primary_schema, general_info_schema, regulatory_schema } from "../schemas/ticket"
import { z } from "zod"
import { Base } from "./base"

export interface TicketPayload {
    'status': string
    'advisor_id':string | null
    'user_id':string
    'lead_id':string | null
    'master_account_id':string | null
    'account_type':string
}

export type Ticket = Base & TicketPayload

export type IndividualTicketPayload = z.infer<ReturnType<typeof general_info_schema>> & z.infer<ReturnType<typeof about_you_primary_schema>> & z.infer<ReturnType<typeof regulatory_schema>>
export type IndividualTicket = IndividualTicketPayload

export type TicketUI = Ticket & {
    ticket_info: IndividualTicket
}