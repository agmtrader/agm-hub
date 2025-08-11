import { z } from "zod"

// Re-use the same follow-up definition as leads
export const pending_task_follow_up_schema = z.object({
  date: z.date({ message: "Follow-up date is required" }),
  description: z.string().min(1, { message: "Follow-up description is required" }),
  completed: z.boolean().default(false)
})

export const pending_task_schema = z.object({
  account_id: z.string().min(1, { message: "Account is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  // UI will provide a JS Date; we convert to timestamp string before sending to API
  date: z.date({ message: "Date is required" }),
  closed: z.boolean().optional().default(false),
  tags: z.array(z.string()).nullable(),
})
