'use client'
import React, { use, useEffect, useState } from 'react'
import { accessAPI } from '@/utils/api'
import { ColumnDefinition, DataTable } from '@/components/dashboard/components/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'

type Props = {
  params: Promise<{
    'report-id': string
  }>
}

const Page = ({ params }: Props) => {

  const { 'report-id': reportId } = use(params)
  const [reportData, setReportData] = useState<any[] | null>(null)

  useEffect(() => {
    const loadFileData = async (fileId: string) => {
      try {
        const response = await accessAPI('/drive/download_file', 'POST', {
          'file_id': fileId,
          'mime_type': 'text/csv'
        })

        const text = await response.text()
        const rows = text.split('\n').map((row: string) => 
          row.split(',').map((cell: string) => cell.trim())
        )

        const [headers, ...dataRows] = rows
        const formattedData = dataRows.map((row: string[]) => {
          const rowData: { [key: string]: string } = {}
          headers.forEach((header: string, index: number) => {
            rowData[header] = row[index]
          })
          return rowData
        })

        setReportData(formattedData)

      } catch (error) {
        console.error('Error loading file:', error)
      }

    }
    
    if (reportId) {
      loadFileData(reportId)
    }
  }, [reportId])

  if (!reportData) return <LoadingComponent/>

  let columns: ColumnDefinition<any>[] = []
  if (reportData.length > 0) {
    columns = Object.keys(reportData[0]).map((key: string) => ({
      field: key,
      header: key,
      accessorKey: key,
    }))
  }

  return (
    <div className='flex flex-col gap-5 max-w-7xl'>
      <DataTable data={reportData} columns={columns} enablePagination pageSize={5}/>
    </div>
  )
}

export default Page