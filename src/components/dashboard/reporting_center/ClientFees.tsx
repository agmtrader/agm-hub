import DashboardPage from '@/components/misc/DashboardPage'
import React from 'react'

type Props = {}

const ClientFees = (props: Props) => {
  return (
    <DashboardPage title='Client Fees' description='View client fees up to date'>
      <div>Client Fees</div>
    </DashboardPage>
  )
}

export default ClientFees