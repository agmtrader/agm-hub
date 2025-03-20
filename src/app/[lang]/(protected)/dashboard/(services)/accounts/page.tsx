'use client'
import DashboardPage from '@/components/misc/DashboardPage'
import { DataTable } from '@/components/misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { ReadAccounts } from '@/utils/entities/account-management'
import React, { useEffect, useState } from 'react'

const page = () => {

    const [data, setData] = useState<any>(null)

    useEffect(() => {
        const fetchAccounts = async () => {
            const accounts = await ReadAccounts()
            //setData(accounts['accounts'])
        }
        fetchAccounts()
    }, [])

    if (!data) return <LoadingComponent/>

    
  return (
    <DashboardPage title="Accounts" description="Accounts">
        <DataTable data={data} infiniteScroll/>
    </DashboardPage>
  )
}

export default page