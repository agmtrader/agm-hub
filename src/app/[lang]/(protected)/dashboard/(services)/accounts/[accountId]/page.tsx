import React from 'react'
import AccountPage from '@/components/dashboard/accounts/AccountPage'
import LoadingComponent from '@/components/misc/LoadingComponent'
import DashboardPage from '@/components/misc/DashboardPage'

type Props = {
  params: Promise<{
    accountId: string
  }>
}

const page = async ({ params }: Props) => {

  const { accountId } = await params
  if (!accountId) return <LoadingComponent className="w-full h-full" />

  return (
    <DashboardPage title="Account Details" description="">
      <AccountPage accountId={accountId} />
    </DashboardPage>
  )
}

export default page