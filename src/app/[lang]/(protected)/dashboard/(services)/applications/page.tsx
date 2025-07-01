'use client'
import DashboardPage from '@/components/misc/DashboardPage'
import React from 'react'
import ApplicationsPage from '@/components/dashboard/entities/applications/ApplicationsPage'

const page = () => {
  return (
    <DashboardPage title="Applications" description="Manage IBKR account applications">
      <ApplicationsPage />
    </DashboardPage>
  )
}

export default page