import { pending_task_schema, pending_task_follow_up_schema } from "@/lib/entities/schemas/pending_task"
import { z } from "zod"
import { Base } from "./base"

export type PendingTaskPayload = z.infer<typeof pending_task_schema>
export type PendingTask = Base & PendingTaskPayload

export type PendingTaskFollowUpPayload = z.infer<typeof pending_task_follow_up_schema> & {
  pending_task_id: string
}
export type PendingTaskFollowUp = Base & PendingTaskFollowUpPayload
