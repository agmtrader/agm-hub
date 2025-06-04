import { z } from "zod"

export const contact_schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  country: z.string().nullable(),
  company_name: z.string().nullable(),
})