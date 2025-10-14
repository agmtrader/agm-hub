import { lead_schema, follow_up_schema } from "@/lib/entities/schemas/lead"
import { z } from "zod"
import { Base } from "./base"

export type AccountType = 'br' | 'ad'
export type Language = 'en' | 'es'

export type LeadPayload = z.infer<typeof lead_schema> & {
    contact_date: string
    closed: string | null
    sent: string | null
    emails_to_notify: string[]
    filled: string | null
}
export type Lead = Base & LeadPayload

export type FollowUpPayload = z.infer<typeof follow_up_schema> & {
    lead_id: string
    emails_to_notify: string[]
}
export type FollowUp = Base & FollowUpPayload