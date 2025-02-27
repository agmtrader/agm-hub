'use client'

import React from 'react'
import { User, Trash, Users, Bell as BellIcon, Ticket, Plus, Bell, ArrowLeft, AlarmClockPlusIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '@/lib/anims'


export function Dashboard() {
  
  const {data:session} = useSession();

  return (
    <div className="flex w-full h-full">
      <div className="flex-1">
        <header className="flex items-center justify-between p-4 border-b border-muted">
          <div className="flex items-center text-foreground space-x-4">
            <User className="w-8 h-8" />
            <h2 className="text-xl font-semibold">{session?.user?.name}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <Input type="search" placeholder="Search..." className="w-64" />
            <Bell className="w-6 h-6" />
          </div>
        </header>
        <main className="flex-grow p-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value={"overview"}>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Summary Card */}
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

                {/* Tickets Card */}
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

                {/* Upcoming Events Card */}
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

                {/* Recent Activity Card - Spans 2 columns */}
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

                {/* Notifications Panel */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle>Notifications</CardTitle>
                      <BellIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { title: "System Update", desc: "New version available", time: "Just now", urgent: true },
                          { title: "Meeting Reminder", desc: "Team standup in 30 minutes", time: "30 min ago", urgent: false },
                          { title: "New Message", desc: "From: Director of Operations", time: "2 hours ago", urgent: false },
                          { title: "Task Assigned", desc: "Review quarterly report", time: "Yesterday", urgent: false },
                        ].map((notification, i) => (
                          <div key={i} className="flex items-start space-x-4">
                            <div className={`rounded-full p-1 ${notification.urgent ? "bg-red-500" : "bg-blue-500"}`}>
                              <Bell className="h-3 w-3 text-white" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">{notification.title}</p>
                              <p className="text-xs text-muted-foreground">{notification.desc}</p>
                              <p className="text-xs text-muted-foreground">{notification.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
