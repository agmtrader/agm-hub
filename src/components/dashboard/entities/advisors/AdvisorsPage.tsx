import React, { useState, useEffect } from 'react'
import { Advisor } from '@/lib/entities/advisor'
import { ColumnDefinition } from '@/components/misc/DataTable'
import { toast } from '@/hooks/use-toast'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { DataTable } from '@/components/misc/DataTable'
import CreateAdvisor from './CreateAdvisor'
import { ReadAdvisors } from '@/utils/entities/advisor'
import AdvisorDialog from './AdvisorDialog'

const AdvisorsPage = () => {

    const [advisors, setAdvisors] = useState<Advisor[] | null>(null)
    const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null)

    async function handleReadAdvisors() {
        try {
            const advisors = await ReadAdvisors()
            setAdvisors(advisors)
        } catch (error: any) {
            toast({
                title: 'Error',
                description: 'Failed to fetch advisors',
                variant: 'destructive',
            })
        }
    }

    useEffect(() => {
        handleReadAdvisors()
    }, [])


    const columns = [
        {
            accessorKey: 'name',
            header: 'Advisor Name',
        },
        {
            accessorKey: 'code',
            header: 'Code',
        },
    ] as ColumnDefinition<Advisor>[]

    const rowActions = [
        {
            label: 'View profile',
            onClick: (row: Advisor) => {
                setSelectedAdvisor(row)
            }
        }
    ]

    if (!advisors) return <LoadingComponent className='h-full w-full'/>

  return (
    <div>
        <div className='flex justify-end mb-4'>
            <CreateAdvisor onSuccess={handleReadAdvisors} />
        </div>
        <DataTable
            data={advisors}
            infiniteScroll
            enableFiltering
            columns={columns}
            enableRowActions
            rowActions={rowActions}
        /> 
        <AdvisorDialog advisor={selectedAdvisor} isOpen={selectedAdvisor !== null} onOpenChange={(open) => {
            if (!open) setSelectedAdvisor(null)
        }}
        />
    </div>
  )
}

export default AdvisorsPage