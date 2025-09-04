'use client'
import AccountsPage from '@/components/dashboard/entities/accounts/AccountsPage'
import DashboardPage from '@/components/misc/DashboardPage'
import React from 'react'

const page = () => {
  return (
    <DashboardPage title="Accounts" description="Manage accounts related to AGM">
      <AccountsPage />
    </DashboardPage>
  )
}

export default page