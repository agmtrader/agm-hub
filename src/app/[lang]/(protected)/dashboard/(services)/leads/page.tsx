import DashboardPage from '@/components/misc/DashboardPage'
import LeadsPage from '@/components/dashboard/leads/LeadsPage'
import React from 'react'

const page = () => {
  return (
    <DashboardPage title="Leads" description="Manage and create new leads">
      <LeadsPage />
    </DashboardPage>
  )
}

export default page