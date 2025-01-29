'use client'
import { accessAPI } from '@/utils/api'
import React, { use, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Advisor } from '@/lib/types'
import { useSession } from 'next-auth/react'

type Props = {
  params: Promise<{
    'advisor-id': string
  }>
}

const page = ({
  params
}: Props) => {

  const { 'advisor-id': advisorId } = use(params)
  const [advisor, setAdvisor] = useState<Advisor | null>(null)
  const {toast} = useToast()
  const {data:session} = useSession()

  useEffect(() => {
    async function fetchData() {
        try {

          let response = await accessAPI('/database/read', 'POST', {
            'path': 'db/advisors/dictionary',
            'query': {
              'AdvisorCode': Number(advisorId)
            }
          })
          if (response.status !== 'success') throw new Error('Error fetching advisor.')
          const advisor = response['content'][0]
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
    <div className='flex flex-col gap-4 w-full h-full p-4 text-foreground'>
        {advisor?.AdvisorCode}
    </div>
  )
}

export default page