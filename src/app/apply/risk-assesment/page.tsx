import RiskForm from '@/components/apply/risk_assesment/RiskForm'
import React from 'react'

const page = () => {
  return (
    <div>
      <div className='w-full px-5 my-28 flex flex-col h-full justify-center'>
        <RiskForm spanish={false}/>
      </div>
    </div>
  )
}

export default page