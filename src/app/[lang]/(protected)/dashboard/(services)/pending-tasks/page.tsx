import DashboardPage from '@/components/misc/DashboardPage'
import PendingTasksPage from '@/components/dashboard/entities/pending-tasks/PendingTasksPage'
import React from 'react'

const page = () => {
  return (
    <DashboardPage title="Pending Tasks" description="Review and manage pending tasks">
      <PendingTasksPage />
    </DashboardPage>
  )
}

export default page
