import Header from '@/components/apply/Header'
import RiskForm from '@/components/apply/risk_assesment/RiskForm'
import React from 'react'

const page = () => {
  return (
    <div>
      <Header bg dark={false}/>
      <div className='w-full mx-8 my-28 flex flex-col h-full justify-center'>
        <RiskForm/>
      </div>
    </div>
  )
}

export default page