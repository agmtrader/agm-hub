import { accessAPI } from "../api"
import { Notification, notification_types } from "@/lib/entities/notification"

export async function CreateNotification(notification:Notification, type:string) {
  let notification_response = await accessAPI('/database/create', 'POST', {
    'path':`db/notifications/${type}`,
    'data':notification,
    'id':notification.NotificationID
  })
  return notification_response
}

export async function ReadNotificationsByType(type:string) {
  let notifications_response = await accessAPI('/database/read', 'POST', {
    'path':`db/notifications/${type}`
  })
  return notifications_response
}

export async function ReadNotifications() {
  let notifications: Notification[] = [];
  for (const type of notification_types) {
    const notifications_response = await ReadNotificationsByType(type);
    if (Array.isArray(notifications_response)) {
      notifications = [...notifications, ...notifications_response];
    }
  }
  return notifications;
}