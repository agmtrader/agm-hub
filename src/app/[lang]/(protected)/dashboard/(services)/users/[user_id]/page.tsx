import React from 'react'
import AccountPage from '@/components/dashboard/entities/accounts/AccountPage'
import LoadingComponent from '@/components/misc/LoadingComponent'
import DashboardPage from '@/components/misc/DashboardPage'
import UserCard from '@/components/dashboard/entities/users/UserCard'
import { ReadUserByID } from '@/utils/entities/user'

type Props = {
  params: Promise<{
    user_id: string
  }>
}

const page = async ({ params }: Props) => {

  const { user_id } = await params
  if (!user_id) return <LoadingComponent className="w-full h-full" />

  const user = await ReadUserByID(user_id)
  if (!user) return <LoadingComponent className="w-full h-full" />

  return (
    <DashboardPage title="User Details" description="">
      <UserCard user={user} />
    </DashboardPage>
  )
}

export default page