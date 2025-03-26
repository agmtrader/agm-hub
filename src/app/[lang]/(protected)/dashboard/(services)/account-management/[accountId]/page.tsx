'use client'
import React, { use } from 'react'
import AccountManagementPage from '@/components/dashboard/account_management/AccountManagementPage'

type Props = {
  params: Promise<{
    accountId: string
  }>
}

const Page = ({ params }: Props) => {
  const { accountId } = use(params)
  
  return (
    <AccountManagementPage accountId={accountId} />
  )
}

export default Page