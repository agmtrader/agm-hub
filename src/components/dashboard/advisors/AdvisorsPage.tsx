import React, { useState, useEffect } from 'react'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { Advisor } from '@/lib/entities/advisor'
import { ColumnDefinition } from '@/components/misc/DataTable'
import { redirect } from 'next/navigation'
import { formatURL } from '@/utils/language/lang'
import { toast } from '@/hooks/use-toast'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { DataTable } from '@/components/misc/DataTable'
import AdvisorApplicationLinks from './AdvisorApplicationLinks'
import { ReadAdvisors } from '@/utils/entities/advisor'

type Props = {}

const AdvisorsPage = (props: Props) => {

    const [advisors, setAdvisors] = useState<Advisor[] | null>(null)
    const [selectedAdvisorForLink, setSelectedAdvisorForLink] = useState<Advisor | null>(null)

    const { lang } = useTranslationProvider()

    useEffect(() => {
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
        handleReadAdvisors()
    }, [])


    const columns = [
        {
            accessorKey: 'AdvisorCode',
            header: 'Advisor Code',
        },
        {
            accessorKey: 'AdvisorName',
            header: 'Advisor Name',
        },
    ] as ColumnDefinition<Advisor>[]

    const rowActions = [
        {
            label: 'View profile',
            onClick: (row: Advisor) => {
                redirect(formatURL(`/dashboard/advisors/${row.AdvisorCode}`, lang))
            }
        }, 
        {
            label: 'Generate application link',
            onClick: (row: Advisor) => {
                setSelectedAdvisorForLink(row)
            }
        }
    ]

  return (
    <div>
        {advisors ? 
            <DataTable
                data={advisors}
                infiniteScroll
                enableFiltering
                filterColumns={['AdvisorName']}
                columns={columns}
                enableRowActions
                rowActions={rowActions}
            /> 
            : 
            <LoadingComponent className='h-full w-full'/>
        }
        <AdvisorApplicationLinks
            advisor={selectedAdvisorForLink}
        />
    </div>
  )
}

export default AdvisorsPage