import { z } from "zod"

export const contact_schema = z.object({
  ContactName: z.string().min(1, { message: "Name is required" }),
  ContactEmail: z.string().optional(),
  ContactPhone: z.string().optional(),
  ContactCountry: z.string().optional(),
  CompanyName: z.string().optional(),
})