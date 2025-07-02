import { z } from "zod"
import { contact_schema } from "./schemas/contact"
import { Base } from "./base"

export type ContactPayload = z.infer<typeof contact_schema>
export type Contact = Base & ContactPayload & {
    user_id: string
}