'use client'

import React from 'react'
import { Bell } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from 'next-auth/react'
import Operational from './Operational'
import Account from '../auth/Account'

export function Dashboard() {
  
  return (
    <div className="flex w-full h-full">
      <div className="flex-1">
        <header className="flex items-center justify-between p-4 border-b border-muted">
          <Account />
          <div className="flex items-center space-x-4">
            <Input type="search" placeholder="Search..." className="w-64" />
            <Bell className="w-6 h-6" />
          </div>
        </header>
        <main className="flex-grow p-6">
          <Tabs defaultValue="operational">
            <TabsList>
              <TabsTrigger value="operational">Operational</TabsTrigger>
              <TabsTrigger value="accounting">Accounting</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>
            <TabsContent value={"operational"}>
              <Operational />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
