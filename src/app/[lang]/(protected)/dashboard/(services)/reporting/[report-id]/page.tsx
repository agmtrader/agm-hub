'use client'
import React, { useEffect, useState } from 'react'
import { accessAPI } from '@/utils/api'
import { ColumnDefinition } from '@/components/dashboard/components/DataTable'
import CSVReader from '@/components/dashboard/components/CSVReader'
import LoadingComponent from '@/components/misc/LoadingComponent'

type Props = {
  params: {
    'report-id': string
  }
}

const Page = ({ params }: Props) => {

  const reportId = params['report-id']
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

  console.log(reportData)

  let columns: ColumnDefinition<any>[] = []
  if (reportData.length > 0) {
    columns = Object.keys(reportData[0]).map((key: string) => ({
      field: key,
      header: key,
      accessorKey: key,
    }))
  }

  return (
    <div>
      <CSVReader data={reportData} columns={columns}/>
    </div>
  )
}

export default Page