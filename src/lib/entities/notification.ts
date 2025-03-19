export interface Notification {
    NotificationID: string
    Title: string
    UserID: string
}

export interface TicketNotification extends Notification {
    TicketID: string
    State: string
}

export interface AccountApplicationNotification extends Notification {
    TicketID: string
    AGMUser: string
    TicketStatus: string
}

export interface RiskProfileNotification extends Notification {
    RiskType: string
}


export const notification_types = [
    'account_applications',
    'risk_profiles',
    'tickets'
]