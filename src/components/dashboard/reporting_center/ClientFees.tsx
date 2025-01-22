import DashboardPage from '@/components/misc/DashboardPage'
import React from 'react'
import { DataTable } from '../components/DataTable'

type Props = {}

const ClientFees = (props: Props) => {
  return (
    <DashboardPage title='Client Fees' description='View client fees up to date'>
      <DataTable data={[]} infiniteScroll={true}/>
    </DashboardPage>
  )
}

export default ClientFees