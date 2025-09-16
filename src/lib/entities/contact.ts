import { contact_schema } from "./schemas/contact"
import { z } from "zod"
import { Base } from "./base"

export type ContactPayload = z.infer<typeof contact_schema>
export type Contact = Base & ContactPayload