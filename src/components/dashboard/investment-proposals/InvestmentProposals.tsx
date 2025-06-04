import React, { useEffect, useState } from 'react'
import { DataTable } from '@/components/misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { FetchInvestmentProposals } from '@/utils/entities/investment-proposal'

const InvestmentProposals = () => {
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
      async function handleFetchInvestmentProposals() {
        const response = await FetchInvestmentProposals()
        setFiles(response)
      }
      handleFetchInvestmentProposals()
    }, [])
  
    if (!files) return <LoadingComponent />

  return (
  <>        
    <DataTable data={files}
          infiniteScroll
          enableRowActions 
          rowActions={rowActions} 
          enableFiltering
      />
    </>
  )
}

export default InvestmentProposals