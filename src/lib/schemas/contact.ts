import { z } from "zod"

export const contact_schema = z.object({
  ContactName: z.string().min(1, { message: "Name is required" }),
  ContactEmail: z.string().optional().or(z.string().email({ message: "Invalid email address" })),
  ContactPhone: z.string().optional().or(z.string().min(1, { message: "Phone number is required" })),
  ContactCountry: z.string().optional().or(z.string().min(1, { message: "Country is required" }))
}) 