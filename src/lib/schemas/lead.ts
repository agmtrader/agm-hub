import { z } from "zod"

export const lead_schema = z.object({
  Name: z.string().min(1, { message: "Name is required" }),
  Email: z.string().email({ message: "Invalid email address" }),
  Phone: z.string().min(1, { message: "Phone number is required" }),
  Description: z.string().min(1, { message: "Description is required" }),
  FollowupDate: z.date({ message: "Follow-up date is required" }),
  Status: z.string().min(1, { message: "Status is required" })
}) 