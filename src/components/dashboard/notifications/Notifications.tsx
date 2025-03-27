import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell } from 'lucide-react'
import { itemVariants } from '@/lib/anims'
import { ReadNotifications } from '@/utils/entities/notification'
import { Notification, TicketNotification, AccountApplicationNotification, RiskProfileNotification } from '@/lib/entities/notification'
import { formatDateFromTimestamp } from '@/utils/dates'
import LoadingCard from '@/components/misc/LoadingCard'
import { useToast } from '@/hooks/use-toast'

const Notifications = () => {

    const { toast } = useToast()
    const [notifications, setNotifications] = useState<Notification[] | null>(null)

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const notifications = await ReadNotifications()
                setNotifications(notifications)
            } catch (error) {
                toast({
                    title: 'Error fetching notifications',
                    description: error instanceof Error ? error.message : 'An unknown error occurred',
                    variant: 'destructive'
                })
            }
        }
        fetchNotifications()
    }, [])

    if (!notifications) return <LoadingCard />

    const renderNotificationContent = (notification: Notification) => {
        // Check if notification is a TicketNotification
        const ticketNotification = notification as TicketNotification
        if (ticketNotification.State) {
            return (
                <>
                    <h3 className="text-md font-bold">{notification.Title}</h3>
                    <p className="text-sm text-muted-foreground">Ticket {ticketNotification.TicketID}</p>
                    <p className="text-sm text-muted-foreground">State: {ticketNotification.State}</p>
                    <p className="text-xs text-muted-foreground">{formatDateFromTimestamp(notification.NotificationID)}</p>
                </>
            )
        }

        // Check if notification is an AccountApplicationNotification
        const accountNotification = notification as AccountApplicationNotification
        if (accountNotification.AGMUser) {
            return (
                <>
                    <h3 className="text-md font-bold">{notification.Title}</h3>
                    <p className="text-sm text-muted-foreground">Ticket {accountNotification.TicketID}</p>
                    <p className="text-sm text-muted-foreground">AGM User: {accountNotification.AGMUser}</p>
                    <p className="text-sm text-muted-foreground">Ticket Status: {accountNotification.TicketStatus}</p>
                    <p className="text-xs text-muted-foreground">{formatDateFromTimestamp(notification.NotificationID)}</p>
                </>
            )
        }

        // Check if notification is a RiskProfileNotification
        const riskNotification = notification as RiskProfileNotification
        if (riskNotification.RiskType) {
            return (
                <>
                    <h3 className="text-md font-bold">Risk Type form filled</h3>
                    <h3> User: {notification.Title}</h3>
                    <p className="text-sm text-muted-foreground">Risk Type: {riskNotification.RiskType}</p>
                    <p className="text-xs text-muted-foreground">{formatDateFromTimestamp(notification.NotificationID)}</p>
                </>
            )
        }


        // Default notification rendering
        return (
            <>
                <h3 className="text-md font-bold">{notification.Title}</h3>
                <p className="text-xs text-muted-foreground">{formatDateFromTimestamp(notification.NotificationID)}</p>
            </>
        )
    }

    return (
        <motion.div variants={itemVariants}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle>Notifications</CardTitle>
                    <Bell className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto">
                        {notifications.slice(0, 10)
                            .map((notification, index) => (
                                <div key={notification.NotificationID} className="text-foreground bg-muted p-2 rounded-md">
                                    {renderNotificationContent(notification)}
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default Notifications