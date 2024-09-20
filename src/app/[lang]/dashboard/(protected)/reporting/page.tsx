'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ReloadIcon, CheckCircledIcon, CrossCircledIcon, UploadIcon } from "@radix-ui/react-icons"
import { accessAPI } from '@/utils/api'
import { DataTable } from '@/components/dashboard/components/DataTable'
import { Upload } from 'lucide-react'

export default function FinancialDashboard() {

    const fetchReports = async () => {
        setGenerating(true)
        const response = await accessAPI('/reporting/generate', 'GET')
        setGenerating(false)
        setReports(response['content'])
        setDialogOpen(true)
        setError(response['status'] === 'error' ? true : false)
    }

    const [reports, setReports] = useState(null)
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-y-10 my-10 text-foreground w-full justify-center items-center">
        <h1 className="text-7xl font-bold">Financial Reports Dashboard</h1>
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
      </div>
      
      {error && (
        <Alert variant="destructive" className="">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-full h-2/3 flex justify-evenly items-center flex-col max-w-7xl">
            <DialogHeader>
                <DialogTitle className='text-5xl font-bold'>Generated Reports</DialogTitle>
            </DialogHeader>
            {reports && <DataTable data={reports} width={100} />}
            <Button className='flex gap-x-2'>
            <Upload/>
                Upload to Database
            </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}