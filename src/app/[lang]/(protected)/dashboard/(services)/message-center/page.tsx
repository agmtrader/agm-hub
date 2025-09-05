import MessageCenter from '@/components/dashboard/tools/message-center/MessageCenter'
import DashboardPage from '@/components/misc/DashboardPage'
import React from 'react'

const page = () => {
  return (
    <DashboardPage
        title="Message Center"
        description="Read IBKR messages from IBKR"
    >
        <MessageCenter />
    </DashboardPage>
  )
}

export default page