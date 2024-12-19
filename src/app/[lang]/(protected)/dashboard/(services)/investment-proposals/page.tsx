'use client'
import { ColumnDefinition, DataTable } from '@/components/dashboard/components/DataTable'
import DocumentViewer from '@/components/dashboard/document_center/DocumentViewer'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { accessAPI } from '@/utils/api'
import React, { useEffect, useState } from 'react'

const Page = () => {

  const [files, setFiles] = useState<any[] | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)

  const handleView = (row: any) => {
    console.log(row)
    setSelectedFileId(row.FileInfo.id)
    setViewDialogOpen(true)
  }

  const rowActions = [
    {
      label: 'View',
      onClick: handleView,
    }
  ]

  useEffect(() => {
    async function fetchInvestmentProposals() {
      let response = await accessAPI('/database/read', 'POST', {
        'path': 'db/document_center/investment_proposals'
      })
      console.log(response)
      if (response['status'] === 'success') {
        setFiles(response['content'])
      } else {
        setFiles(null)
      }

    }
    fetchInvestmentProposals()
  }, [])

  if (!files) return <LoadingComponent />

  console.log(files)

  return (
    <div className='flex flex-col text-foreground gap-5 w-full'>
      <p className='text-5xl font-bold'>Investment Proposals</p>
      <p className='text-xl'>Lookup all investment proposals for a user</p>
      <DataTable data={files}
        enablePagination 
        enableRowActions 
        rowActions={rowActions} 
        enableFiltering
        filterColumns={['ClientName']}
      />
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-[80%] h-[80vh]">
          {selectedFileId && <DocumentViewer fileId={selectedFileId} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page