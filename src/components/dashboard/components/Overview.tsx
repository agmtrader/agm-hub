import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Ticket, AlarmClockPlusIcon, Bell, User } from 'lucide-react'
import { containerVariants, itemVariants } from '@/lib/anims'
import Notifications from './Notifications'

const Overview = () => {
    
  return (
    <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
        <motion.div variants={itemVariants}>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
            </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">-8% from last week</p>
            </CardContent>
            </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <AlarmClockPlusIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">Next event in 2 days</p>
            </CardContent>
            </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2">
            <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {[
                    { action: "File uploaded", user: "Sarah Johnson", time: "2 hours ago" },
                    { action: "Project created", user: "Michael Chen", time: "Yesterday" },
                    { action: "Comment added", user: "Alex Rodriguez", time: "2 days ago" },
                    { action: "Task completed", user: "Jamie Smith", time: "3 days ago" },
                ].map((activity, i) => (
                    <div key={i} className="flex items-center">
                    <div className="mr-4 rounded-full bg-primary/10 p-2">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                        {activity.user} • {activity.time}
                        </p>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>
        </motion.div>

        <Notifications />

    </motion.div>
  )
}

export default Overview