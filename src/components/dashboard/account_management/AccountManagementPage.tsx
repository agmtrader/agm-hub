import DashboardPage from '@/components/misc/DashboardPage'
import LoadingComponent from '@/components/misc/LoadingComponent'

import { Account } from '@/lib/entities/account'
import { ReadAccountByAccountNumber } from '@/utils/entities/account'
import { ReadAccountDetailsByAccountNumber } from '@/utils/entities/account-management'

import React, { useEffect, useState } from 'react'

type Props = {
  accountId: string
}

const AccountManagementPage = ({accountId}: Props) => {

  const [account, setAccount] = useState<Account | null>(null)
  const [accountDetails, setAccountDetails] = useState<any | null>(null)
  
  useEffect(() => {
    async function handleFetchData() {
      const account = await ReadAccountByAccountNumber(accountId)
      setAccount(account)

      const accountDetails = await ReadAccountDetailsByAccountNumber(accountId)
      setAccountDetails(accountDetails)
    }
    handleFetchData()
  }, [accountId])

  console.log(account, accountDetails)

  if (!account || !accountDetails) return <LoadingComponent className='w-full h-full' />

  return (
    <DashboardPage title="Account Management" description={`${accountId}`}>
      Main email: {accountDetails['account']['emailAddress']}
      <br />
      Temporal email: {account['TemporalEmail']}
      <br />
    </DashboardPage>
  )
}

export default AccountManagementPage