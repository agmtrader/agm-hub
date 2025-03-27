'use client'
import React, { use } from 'react'
import AccountPage from '@/components/dashboard/account_management/AccountPage'

type Props = {
  params: Promise<{
    accountId: string
  }>
}

const page = ({ params }: Props) => {
  const { accountId } = use(params)
  
  return (
    <AccountPage accountId={accountId} />
  )
}

export default page