import UsersPage from '@/components/dashboard/entities/users/UsersPage'
import DashboardPage from '@/components/misc/DashboardPage'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <DashboardPage title='Users' description='Manage users'>
        <UsersPage />
    </DashboardPage>
  )
}

export default page