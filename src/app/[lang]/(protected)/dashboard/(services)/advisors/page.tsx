'use client'

import { DataTable } from '@/components/dashboard/components/DataTable'
import DashboardPage from '@/components/misc/DashboardPage'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { toast } from '@/hooks/use-toast'
import { Advisor } from '@/lib/types'
import { accessAPI } from '@/utils/api'
import React, { useEffect, useState } from 'react'

const page = () => {

    const [advisors, setAdvisors] = useState<Advisor[] | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await accessAPI('/database/read', 'POST', {
                        'path': 'db/advisors/dictionary',
                        'params': {}
                })
                if (response['status'] !== 'success') throw new Error(response['message'])
                setAdvisors(response['content'])
            } catch (error: any) {
                toast({
                    title: 'Error',
                    description: 'Failed to fetch advisors',
                    variant: 'destructive',
                })
            }
        }
        fetchData()
    }, [])

    return (
        <DashboardPage title='Advisor Center' description='Manage, contact and more'>
            {advisors ? 
                <DataTable
                    data={advisors}
                    enablePagination
                    enableFiltering
                    filterColumns={['AdvisorName']}
                /> 
                : 
                <LoadingComponent className='h-full w-full'/>
            }
        </DashboardPage>
  )
}

export default page