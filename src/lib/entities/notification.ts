export interface Notification {
    NotificationID: string
    UserID: string
    Title: string
    Description: string
}

export const notification_types = [
    'account_applications',
    'risk_profiles'
]