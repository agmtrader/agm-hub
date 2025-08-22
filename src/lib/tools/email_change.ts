import { email_change_schema } from "@/lib/entities/schemas/email_change"
import { z } from "zod"
import { Base } from "./base"

export type EmailChangePayload = z.infer<typeof email_change_schema>
export type EmailChange = Base & EmailChangePayload
