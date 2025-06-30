'use client'
import DashboardPage from '@/components/misc/DashboardPage'
import React from 'react'
import ApplicationsPage from '@/components/dashboard/entities/applications/ApplicationsPage'

const page = () => {
  return (
    <DashboardPage title="Applications" description="Manage applications related to AGM">
      <ApplicationsPage />
    </DashboardPage>
  )
}

export default page