import { z } from "zod"

export const pending_task_follow_up_schema = z.object({
  date: z.date({ message: "Follow-up date is required" }),
  description: z.string().min(1, { message: "Follow-up description is required" }),
  completed: z.boolean().default(false)
})

export const pending_task_schema = z.object({
  account_id: z.string().min(1, { message: "Account is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  closed: z.boolean().optional().default(false),
  tags: z.array(z.string()).nullable(),
  priority: z.number().min(1, { message: "Priority is required" }).max(3, { message: "Priority must be between 1 and 3" }),
  emails_to_notify: z.array(z.string()).nullable(),
})