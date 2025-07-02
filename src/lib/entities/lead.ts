import { lead_schema, follow_up_schema } from "@/lib/entities/schemas/lead"
import { z } from "zod"
import { Base } from "./base"

export type LeadPayload = z.infer<typeof lead_schema> & {
    status: string
    completed: boolean
    contact_date: string
}
export type Lead = Base & LeadPayload

export type FollowUpPayload = z.infer<typeof follow_up_schema> & {
    lead_id: string
}
export type FollowUp = Base & FollowUpPayload