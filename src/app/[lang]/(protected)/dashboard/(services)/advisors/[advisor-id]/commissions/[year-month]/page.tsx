'use client'
import { accessAPI } from '@/utils/api'
import React, { use, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Advisor } from '@/lib/entities/advisor'
import { Commission } from '@/lib/entities/commission'

type Props = {
  params: Promise<{
    'year-month': string
    'advisor-id': string
  }>
}

const page = ({
  params
}: Props) => {

  const { 'year-month': yearMonth, 'advisor-id': advisorId } = use(params)

  const [advisor, setAdvisor] = useState<Advisor | null>(null)
  const [commissions, setCommissions] = useState<Commission | null>(null)
  const {toast} = useToast()

  useEffect(() => {
    async function fetchData() {
        try {

          // Fetch advisor
          let response = await accessAPI('/database/read', 'POST', {
            'path': 'db/advisors/dictionary',
            'params': {
              'AdvisorCode': advisorId
            }
          })
          if (response.status !== 'success') throw new Error('Error fetching advisor')
          const advisor = response['content'][0]
          setAdvisor(advisor)

          // Fetch commissions
          response = await accessAPI('/advisors/commissions', 'GET')
          if (response.status !== 'success') throw new Error('Error fetching commissions')
          const commissions = response['content']

          // Filter commissions
          const filteredCommissions = commissions.filter((commission: Commission) => commission.YYYYMM.toString() === yearMonth && commission.Beneficiary === advisor.AdvisorName)
          setCommissions(filteredCommissions[0])

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

  return (
    <div className='flex flex-col gap-4 w-full h-full p-4 text-foreground'>
      <p className='text-2xl font-bold'>Commissions Report</p>
      <div className='flex flex-col gap-2'>
        <p className='text-lg font-bold'>{new Date(yearMonth).toLocaleDateString()}</p>
        <p className='text-sm'>Close date</p>
      </div>
      
      <div className='flex flex-col gap-2'>
        <p className='text-lg font-bold'>{advisor?.AdvisorName}</p>
        <p className='text-sm'>Close date</p>
      </div>

      <div className='flex flex-col gap-2'>
        <p className='text-lg font-bold'>{commissions?.Amount.toFixed(2)}</p>
        <p className='text-sm'>Commissions</p>
      </div>
    </div>
  )
}

export default page