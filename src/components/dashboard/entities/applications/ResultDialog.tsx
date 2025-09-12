import { DataTable } from '@/components/misc/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogContent } from '@/components/ui/dialog'
import { DialogHeader } from '@/components/ui/dialog';
import React from 'react'

type Props = {
    resultData: any
    isResultDialogOpen: boolean
    setIsResultDialogOpen: (open: boolean) => void
}

const ResultDialog = ({ resultData, isResultDialogOpen, setIsResultDialogOpen }: Props) => {
  
    if (!resultData) return null;
    const status = resultData.fileData?.data?.application?.status
    const errors = resultData.fileData?.data?.application?.error || []
    const account = resultData.fileData?.data?.application?.accounts?.[0]

    return (
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}> 
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{status === 'Success' ? 'Successfully Sent to IBKR' : 'Rejected'}</DialogTitle>
        </DialogHeader>
        {status === 'Success' ? (
          <div className="space-y-4">
            <p className="text-sm text-foreground">Account Number: {account?.value}</p>
            <Button>Send email with credentials to user</Button>
          </div>
          ) : (
          <div className="space-y-4">
            <p className="text-sm text-error">Rejected</p>
            <p className="text-sm text-foreground">The following errors occurred:</p>
            <DataTable
              data={errors}
              columns={[{ header: 'Error', accessorKey: 'value' }]}
            />
          </div>
          )}
      </DialogContent> 
      </Dialog>
    )
}

export default ResultDialog