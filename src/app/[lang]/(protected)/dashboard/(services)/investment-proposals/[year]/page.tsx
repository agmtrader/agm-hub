'use client'
import { ColumnDefinition, DataTable } from '@/components/dashboard/components/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { accessAPI } from '@/utils/api'
import React, { use, useEffect, useState } from 'react'

type Props = {
  params: Promise<{
    'year': string
  }>
}

const Page = ({ params }: Props) => {

  const { 'year': year } = use(params)
  console.log(year)

  const [files, setFiles] = useState<any[] | null>(null)

  const rowActions = [
    {
      label: 'View',
      onClick: (row: any) => {
        
      }
    }
  ]

  const columns = [
    {
      accessorKey: 'ClientName',
      header: 'Client Name'
    },
    {
      accessorKey: 'FileInfo.name',
      header: 'File Name'
    },
    {
      accessorKey: 'FileInfo.id',
      header: 'File ID'
    }
  ] as ColumnDefinition<any>[]

  console.log(year)

  useEffect(() => {
    async function fetchInvestmentProposals() {
      let response = await accessAPI('/database/read', 'POST', {
        'path': 'db/document_center/investment_proposals',
        'query': {
          'YearEmmitted': year
        }
      })
      setFiles(response['content'])

    }
    fetchInvestmentProposals()
  }, [year])

  if (!files) return <LoadingComponent />

  console.log(files)

  return (
    <div className='flex flex-col text-foreground gap-4 w-full'>
      <p className='text-2xl font-medium'>Investment Proposals for {year}</p>
      <DataTable data={files} columns={columns} enablePagination enableRowActions rowActions={rowActions} />
    </div>
  )
}

export default Page