'use client'
import { ColumnDefinition, DataTable } from '@/components/dashboard/components/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { Button } from '@/components/ui/button'
import { accessAPI } from '@/utils/api'
import React, { useEffect, useState } from 'react'

const Page = () => {

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


  useEffect(() => {
    async function fetchInvestmentProposals() {
      let response = await accessAPI('/database/read', 'POST', {
        'path': 'db/document_center/investment_proposals'
      })
      setFiles(response['content'])

    }
    fetchInvestmentProposals()
  }, [])

  if (!files) return <LoadingComponent />

  console.log(files)

  return (
    <div className='flex flex-col text-foreground gap-5 w-full'>
      <p className='text-5xl font-bold'>Investment Proposals</p>
      <p className='text-xl'>Lookup all investment proposals for a user</p>
      <Button onClick={() => {
        accessAPI('/investment_proposals/backup_investment_proposals', 'GET')
      }}>Backup Investment Proposals</Button>
      <DataTable data={files} columns={columns} enablePagination enableRowActions rowActions={rowActions} />
    </div>
  )
}

export default Page