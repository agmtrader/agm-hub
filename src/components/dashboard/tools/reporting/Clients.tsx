import React, { useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { ColumnDefinition, DataTable } from '../../../misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { GetDimensionalTable } from '@/utils/tools/reporting'

const Clients = () => {

  const [data, setData] = useState<any[] | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        let report = await GetDimensionalTable()
        console.log(report)
        setData(report['consolidated'])
      } catch (error:any) {
        toast({
          title: 'Error fetching clients',
          description: error.message,
          variant: 'destructive',
        })
      }
    }
    fetchData()
  }, [])

  const columns = [
    {
      header: 'Account ID',
      accessorKey: 'Account ID',
    },
    {
      header: 'Master Account',
      accessorKey: 'sheet_name',
    },
    {
      header: 'Account Title',
      accessorKey: 'Title',
    }
  ] as ColumnDefinition<any>[]

  if (!data) return <LoadingComponent className='h-full w-full'/>

return (
  <div className='max-w-7xl h-full flex flex-col gap-5'>
    <DataTable 
        data={data}
        enablePagination
        infiniteScroll
        pageSize={5}
      />
  </div>
)
}

export default Clients