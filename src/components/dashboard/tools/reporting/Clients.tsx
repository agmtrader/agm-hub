import React, { useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { DataTable } from '../../../misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { GetClientsReport } from '@/utils/tools/reporting'

const Clients = () => {

  const [data, setData] = useState<any[] | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        let report = await GetClientsReport()
        setData(report)
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

  if (!data) return <LoadingComponent className='h-full w-full'/>

return (
  <div className='w-full h-full flex flex-col gap-5'>
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