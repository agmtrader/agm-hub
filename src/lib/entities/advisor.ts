import { z } from "zod"
import { Base } from "./base"
import { advisor_schema } from "./schemas/advisor"

export type AdvisorPayload = z.infer<typeof advisor_schema>
export type Advisor = Base & AdvisorPayload