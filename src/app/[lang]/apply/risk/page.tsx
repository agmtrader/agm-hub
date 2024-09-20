import RiskForm from '@/components/apply/risk/RiskForm'
import { FormHeader } from '@/components/Header'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

const page = () => {
  return (
    <div className='w-full flex flex-col h-full'>
      <FormHeader />
      <RiskForm/>
    </div>
  )
}

export default page