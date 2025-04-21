import { z } from "zod"

const followUp_schema = z.object({
  date: z.date({ message: "Follow-up date is required" }),
  description: z.string().min(1, { message: "Follow-up description is required" }),
  completed: z.boolean().default(false)
})

export const lead_schema = z.object({
  Name: z.string().min(1, { message: "Name is required" }),
  Email: z.string().email({ message: "Invalid email address" }).optional(),
  PhoneCountry: z.string().min(1, { message: "Phone country is required" }).optional(),
  Phone: z.string().min(1, { message: "Phone number is required" }).optional(),
  Referrer: z.string().min(1, { message: "Referrer is required" }).optional(),
  Description: z.string().min(1, { message: "Description is required" }),
  FollowUps: z.array(followUp_schema).min(1, { message: "At least one follow-up is required" })
}) 