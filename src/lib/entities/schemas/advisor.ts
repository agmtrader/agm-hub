import { z } from "zod"

export const advisor_schema = z.object({
    name: z.string(),
    agency: z.string(),
    hierarchy1: z.string(),
    hierarchy2: z.string(),
    code: z.string(),
    contact_id: z.string(),
})