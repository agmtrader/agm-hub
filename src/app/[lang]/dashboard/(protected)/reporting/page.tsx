'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ReloadIcon } from "@radix-ui/react-icons"
import { accessAPI } from '@/utils/api'
import { Upload } from 'lucide-react'
import { DataTableSelect } from '@/components/dashboard/components/DataTable'

export default function FinancialDashboard() {

  const [batchFiles, setBatchFiles] = useState<any[] | null>(null)
  const [generating, setGenerating] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const [resourcesFiles, setResourcesFiles] = useState<any[] | null>(null)
  const [transforming, setTransforming] = useState<boolean>(false)

    async function fetchReports() {
        setGenerating(true)
        const response = await accessAPI('/reporting/extract', 'GET')
        setGenerating(false)
        setBatchFiles(response['content'])
        setError(response['status'] === 'error' ? true : false)
        if (!error) setDialogOpen(true)
    }

    async function transformReports() {
      setTransforming(true)
      const response = await accessAPI('/reporting/transform', 'GET')
      setResourcesFiles(response['content'])
      setTransforming(false)
      setError(response['status'] === 'error' ? true : false)
      if (!error) setDialogOpen(false)
    }

    async function uploadReports() {
      const response = await accessAPI('/reporting/load', 'GET')
      setError(response['status'] === 'error' ? true : false)
    }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-y-10 my-10 text-foreground w-full justify-center items-center">
        <h1 className="text-7xl font-bold">AGM Reporting</h1>
        {!resourcesFiles && 
          <Button onClick={fetchReports} disabled={generating}>
            {generating ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Reports'
            )}
          </Button>
        } 
      </div>
      
      {error && (
        <Alert variant="destructive" className="">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!transforming && !error && resourcesFiles &&
        <div className='flex flex-col gap-y-10 justify-center items-center text-foreground'>
          <DataTableSelect setSelection={() => {}} data={resourcesFiles} width={90} />
          <Button onClick={uploadReports} disabled={transforming} className='flex gap-x-2'>
            <Upload/>
            Upload Reports
          </Button>
        </div>
      }

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-full h-2/3 flex justify-center gap-y-10 items-center flex-col max-w-7xl">
            <DialogHeader>
                <DialogTitle className='text-5xl font-bold'>Generated Reports</DialogTitle>
            </DialogHeader>
            {batchFiles && !error ? <DataTableSelect setSelection={() => {}} data={batchFiles} width={90} /> : <div>Error fetching or backing up reports. Check Batch and Backups folder as well as the logs.</div>}
            <Button onClick={transformReports} disabled={transforming} className='flex gap-x-2'>
              {transforming ? (
                  <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                  </>
              ) : (
                <>
                  <Upload/>
                  Process reports
                </>
              )}
            </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}