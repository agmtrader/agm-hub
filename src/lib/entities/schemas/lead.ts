import { z } from "zod"

export const follow_up_schema = z.object({
  date: z.date({ message: "Follow-up date is required" }),
  description: z.string().min(1, { message: "Follow-up description is required" }),
  completed: z.boolean().default(false)
})

export const lead_schema = z.object({
  contact_id: z.string().min(1, { message: "Contact is required" }),
  referrer_id: z.string().min(1, { message: "Referrer is required" }),
  description: z.string().min(1, { message: "Description is required" }),
})