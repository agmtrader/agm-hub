import EmailChangePage from '@/components/dashboard/tools/email_change/EmailChange'
import DashboardPage from '@/components/misc/DashboardPage'
import React from 'react'

const page = () => {
  return (
    <DashboardPage title="Email Change" description="View IBKR email changes">
      <EmailChangePage />
    </DashboardPage>
  )
}

export default page