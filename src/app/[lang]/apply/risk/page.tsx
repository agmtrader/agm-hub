import RiskForm from '@/components/apply/risk_assesment/RiskForm'
import { FormHeader } from '@/components/Header'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-full flex flex-col justify-center items-start'>
      <FormHeader />
      <div className='w-full px-5 my-10 flex flex-col h-full justify-center'>
        <RiskForm/>
      </div>
    </div>
  )
}

export default page