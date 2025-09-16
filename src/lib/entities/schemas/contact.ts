import { z } from "zod"

export const contact_schema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    image: z.string().optional(),
    country: z.string().optional(),
    company_name: z.string().optional(),
})