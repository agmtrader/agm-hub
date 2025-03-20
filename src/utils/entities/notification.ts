import { accessAPI } from "../api"
import { Notification } from "@/lib/entities/notification"

export async function CreateNotification(notification:Notification, type:string) {
  let notification_response = await accessAPI('/notifications/create', 'POST', {
    'notification':notification,
    'type':type
  })
  return notification_response
}

export async function ReadNotificationsByType(type:string) {
  let notifications_response = await accessAPI('/notifications/read_by_type', 'POST', {
    'type':type
  })
  return notifications_response
}

export async function ReadNotifications() {
  let notifications_response = await accessAPI('/notifications/read', 'GET')
  console.log(notifications_response)
  return notifications_response
}