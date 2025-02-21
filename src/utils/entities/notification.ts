import { accessAPI } from "../api"
import { Notification } from "@/lib/entities/notification"

export async function CreateNotification(notification:Notification, type:string) {
  let response = await accessAPI('/database/create', 'POST', {
    'path':`db/notifications/${type}`,
    'data':notification,
    'id':notification.id
  })

  if (response['status'] !== 'success') {
    throw new Error(response['message'])
  }
}