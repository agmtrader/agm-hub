import { accessAPI } from "../api"
import { IDResponse } from "@/lib/entities/base"
import { PendingTask, PendingTaskPayload, PendingTaskFollowUpPayload, PendingTaskFollowUp } from "@/lib/entities/pending_task"

// Create a new pending task with optional follow-ups
export async function CreatePendingTask(task: PendingTaskPayload, follow_ups: PendingTaskFollowUpPayload[]): Promise<IDResponse> {
  const response: IDResponse = await accessAPI('/pending_tasks/create', 'POST', {
    'task': task,
    'follow_ups': follow_ups,
  })
  return response
}

export async function ReadPendingTasks() {
  const tasksWithFollowUps: { pending_tasks: PendingTask[]; follow_ups: PendingTaskFollowUp[] } = await accessAPI('/pending_tasks/read', 'GET')
  return tasksWithFollowUps
}

export async function ReadPendingTaskByID(taskID: string) {
  const tasksWithFollowUps: { pending_tasks: PendingTask[]; follow_ups: PendingTaskFollowUp[] } = await accessAPI(`/pending_tasks/read?id=${taskID}`, 'GET')
  return tasksWithFollowUps
}

export async function UpdatePendingTaskByID(taskID: string, task: Partial<PendingTaskPayload>): Promise<IDResponse> {
  const updateResponse: IDResponse = await accessAPI('/pending_tasks/update', 'POST', {
    'query': { 'id': taskID },
    'task': task,
  })
  return updateResponse
}

// Follow-ups --------------------------------------------------------------

export async function CreatePendingTaskFollowUp(taskID: string, followUp: Omit<PendingTaskFollowUpPayload, 'pending_task_id'>): Promise<IDResponse> {
  const response: IDResponse = await accessAPI('/pending_tasks/follow_up/create', 'POST', {
    'pending_task_id': taskID,
    'follow_up': followUp,
  })
  return response
}

export async function UpdatePendingTaskFollowUpByID(taskID: string, followUpID: string, followUp: PendingTaskFollowUpPayload): Promise<IDResponse> {
  const response: IDResponse = await accessAPI('/pending_tasks/follow_up/update', 'POST', {
    'pending_task_id': taskID,
    'follow_up_id': followUpID,
    'follow_up': followUp,
  })
  return response
}

export async function DeletePendingTaskFollowUpByID(taskID: string, followUpID: string): Promise<IDResponse> {
  const response: IDResponse = await accessAPI('/pending_tasks/follow_up/delete', 'POST', {
    'pending_task_id': taskID,
    'follow_up_id': followUpID,
  })
  return response
}
