import PendingAliases from '@/components/dashboard/tools/reporting/PendingAliases'
import DashboardPage from '@/components/misc/DashboardPage'
import React from 'react'

const page = () => {
  return (
    <DashboardPage title='Pending Aliases' description='View accounts that need to be aliased in IBKR'>
        <PendingAliases />
    </DashboardPage>
  )
}

export default page