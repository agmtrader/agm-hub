'use client'
import React, { useEffect, useState } from 'react'
import { accessAPI } from '@/utils/api'
import { ColumnDefinition, DataTable } from './DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'

type Props = {}

const CSVReader = (props: Props) => {
    const [data, setData] = useState<Record<string, string>[] | null>(null)
    const fileId = '135OpxqyH54uEGj8fRJyAjL34JZ1GoGD1'
  
    const [columns, setColumns] = useState<ColumnDefinition<any>[]>([])
  
    const allowedColumns = ['AccountAlias', 'ClientAccountID']
  
    useEffect(() => {
      async function fetchData() {
        try {
          const response = await accessAPI('/drive/download_file', 'POST', {
            'file_id': fileId,
            'mime_type': 'text/csv'
          })
  
          const text = await response.text()
          const rows = text.split('\n').map((row: string) => 
            row.split(',').map((cell: string) => cell.trim())
          )
  
          const headers = rows[0]
        
          const columnDefs = headers
            .filter((header: string) => allowedColumns.includes(header))
            .map((header: string) => ({
              header,
              accessorKey: header,
            }))
          setColumns(columnDefs)
  
          const dataRows = rows.slice(1).map((row: string[]) => 
            Object.fromEntries(
              headers
                .map((header: string, index: number) => [header, row[index]])
                .filter(([header]: any) => allowedColumns.includes(header))
            )
          )
          
          setData(dataRows)
  
        } catch (error) {
          console.error('Error fetching CSV:', error)
        }
      }
      fetchData()
    }, [])
  
    if (!data) return <LoadingComponent/>
    if (data.length === 0) return <div>No data</div>
  
    return (
      <div className='w-full h-full'>
        <DataTable data={data} columns={columns} width={100}/>
      </div>
    )
}

export default CSVReader