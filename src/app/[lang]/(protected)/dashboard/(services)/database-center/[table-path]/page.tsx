'use client'
import React, { use, useEffect, useState } from 'react'
import { accessAPI } from '@/utils/api'
import { ColumnDefinition } from '@/components/dashboard/components/DataTable'
import CSVReader from '@/components/dashboard/components/CSVReader'
import LoadingComponent from '@/components/misc/LoadingComponent'

type Props = {
  params: Promise<{
    'table-path': string
  }>
}

const Page = ({ params }: Props) => {

  const { 'table-path': tablePath } = use(params)
  const [tableData, setTableData] = useState<any[] | null>(null)

  useEffect(() => {
    const loadFileData = async (tablePath: string) => {
      try {

        const response = await accessAPI('/database/read', 'POST', {
          'path': tablePath,
          'params': {}
        })

        setTableData(response['content'])

      } catch (error) {
        console.error('Error loading file:', error)
      }

    }
    
    if (tablePath) {
      loadFileData(tablePath)
    }
  }, [tablePath])

  if (!tableData) return <LoadingComponent/>

  console.log(tableData)

  let columns: ColumnDefinition<any>[] = []
  if (tableData.length > 0) {
    columns = Object.keys(tableData[0]).map((key: string) => ({
      field: key,
      header: key,
      accessorKey: key,
    }))
  }

  return (
    <div>
      <CSVReader data={tableData} columns={columns}/>
    </div>
  )
}

export default Page