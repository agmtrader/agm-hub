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
    

      {/* Main content */}
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
            <TabsContent value="overview" className="space-y-4">
              <motion.div 
                className="grid grid-cols-5 grid-rows-5 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Card className="col-span-1 row-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$2,231.89</div>
                      <p className="text-xs">+20.1% from last month</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="col-span-1 row-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">New clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+12</div>
                      <p className="text-xs">+180.1% from last month</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="col-span-1 row-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Commissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+$435</div>
                      <p className="text-xs">+19% from last month</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="col-span-1 row-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Users Trading Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+10</div>
                      <p className="text-xs">+4 since last hour</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="col-span-3 row-span-2 row-start-2">
                    <CardHeader>
                      <CardTitle>Open account applications</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="row-span-2 col-start-4 row-start-2">
                    <CardHeader>
                      <CardTitle>Test</CardTitle>
                      <CardContent>
                        <p className="text-sm"></p>
                      </CardContent>
                    </CardHeader>
                    <CardContent>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="col-span-2 row-span-2 row-start-4">
                    {/* Add content for the new card in position 13 */}
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="col-span-2 row-span-2 col-start-3 row-start-4">
                    {/* Add content for the new card in position 14 */}
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
