'use client'
import React, { use, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Advisor } from '@/lib/entities/advisor'
import { useSession } from 'next-auth/react'
import { ReadAdvisorByAdvisorCode } from '@/utils/entities/advisor'
import DashboardPage from '@/components/misc/DashboardPage'

type Props = {
  params: Promise<{
    'advisor-id': string
  }>
}

const AdvisorPage = ({
  params
}: Props) => {

  const { 'advisor-id': advisorId } = use(params)
  const [advisor, setAdvisor] = useState<Advisor | null>(null)
  const {toast} = useToast()
  const {data:session} = useSession()

  useEffect(() => {
    async function fetchData() {
        try {

          let advisor = await ReadAdvisorByAdvisorCode(Number(advisorId))
          if (!advisor) throw new Error('Advisor not found.')

          if (advisor.UserID !== session?.user.id) throw new Error('Advisor not authenticated.')
          setAdvisor(advisor)

        } catch (error) {
            toast({
                title: 'Error fetching advisor',
                description: (error as Error).message,
                variant: 'destructive',
            })
        }
      }
    fetchData()
  }, [])

  return (
    <DashboardPage title='Advisor Management Portal' description='Manage your advisor profile and more'>
      <div className='flex flex-col gap-4 w-full h-full p-4 text-foreground'>
        <div className='flex flex-col gap-2'>
          <p className='text-lg font-bold'>{advisor?.AdvisorCode}</p>
          <p className='text-sm'>Advisor Code</p>
        </div>
      </div>
    </DashboardPage>
  )
}

export default AdvisorPage