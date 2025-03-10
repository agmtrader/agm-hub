'use client'

import React from 'react'
import { User, Bell } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from 'next-auth/react'
import Overview from './components/Overview'  

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
              <Overview />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
