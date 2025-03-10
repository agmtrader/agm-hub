import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell } from 'lucide-react'
import { itemVariants } from '@/lib/anims'
import { ReadNotifications } from '@/utils/entities/notification'
import { Notification } from '@/lib/entities/notification'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { formatDateFromTimestamp } from '@/utils/dates'

const Notifications = () => {

    const [notifications, setNotifications] = useState<Notification[] | null>(null)

    useEffect(() => {
        const fetchNotifications = async () => {
            const notifications = await ReadNotifications()
            setNotifications(notifications)
        }
        fetchNotifications()
    }, [])

    if (!notifications) return <LoadingComponent />

  return (
    <motion.div variants={itemVariants}>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Notifications</CardTitle>
                <Bell className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto">
                    {notifications.slice(0, 10).map((notification) => (
                        <div className="text-foreground bg-muted p-2 rounded-md">
                            <h3 className="text-md font-bold">{notification.Title}</h3>
                            <p className="text-s text-muted-foreground">{formatDateFromTimestamp(notification.NotificationID)}</p>
                            <p className="text-sm">{notification.Description}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </motion.div>
  )
}

export default Notifications