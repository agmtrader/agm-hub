'use client'
import { accessAPI } from '@/utils/api'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ColumnDefinition, DataTable } from '@/components/misc/DataTable'
import { useToast } from '@/hooks/use-toast'
import { Advisor } from '@/lib/entities/advisors'
import LoadingComponent from '@/components/misc/LoadingComponent'

interface Commission {
  Amount: number
  Beneficiary: string
  YYYY: number
  YYYYMM: number
}

const AdvisorInvoice = () => {
  const [commissions, setCommissions] = useState<Commission[] | null>(null)
  const [advisor, setAdvisor] = useState<Advisor | null>(null)

  const [selectedMonth, setSelectedMonth] = useState<string>('202401')
  const [months, setMonths] = useState<string[]>([])



  const {toast} = useToast()

  const columns = [
    {
      accessorKey: 'Beneficiary',
      header: 'Beneficiary',
    },
    {
      accessorKey: 'Amount',
      header: 'Amount',
    },
  ] as ColumnDefinition<Commission>[]

  useEffect(() => {
    async function fetchData() {
        try{
            const response = await accessAPI('/advisors/commissions', 'GET')
            if (response.status !== 'success') throw new Error('Error fetching commissions')
            setCommissions(response['content'])
            const uniqueMonths = [...new Set(response.content.map((item: Commission) => item.YYYYMM.toString()))] as string[]
            setMonths(uniqueMonths)
        } catch (error) {
            toast({
                title: 'Error fetching commissions',
                description: 'Please try again later',
                variant: 'destructive',
            })
        }
      }
    fetchData()
  }, [])

  if (!commissions) return <LoadingComponent className='w-full h-full'/>

  const filteredCommissions = commissions.filter((commission) => commission.YYYYMM.toString() === selectedMonth)

  return (
    <div className='flex flex-col gap-4 w-full h-full p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Commissions</h1>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <DataTable columns={columns} data={filteredCommissions} enablePagination />
      </div>
    </div>
  )
}

export default AdvisorInvoice