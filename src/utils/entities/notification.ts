import { accessAPI } from "../api"
import { Notification } from "@/lib/entities/notification"

export async function CreateNotification(notification:Notification, type:string) {
  let notification_response = await accessAPI('/database/create', 'POST', {
    'path':`db/notifications/${type}`,
    'data':notification,
    'id':notification.id
  })
  return notification_response
}

export async function ReadNotifications(type:string) {
  let notifications_response = await accessAPI('/database/read', 'POST', {
    'path':`db/notifications/${type}`
  })
  return notifications_response
}