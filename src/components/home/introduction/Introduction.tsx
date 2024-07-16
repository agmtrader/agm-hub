import React from 'react'
import { Button } from '@/components/ui/button'

const Introduction = () => {
  return (
    <div className='flex flex-col h-full w-full justify-center items-center py-10'>
      <div className='flex flex-col h-full w-[50%] text-center gap-y-10 justify-center items-center'>
        <p className='text-5xl font-bold'>Empowering Tomorrows Markets</p>
        <p className='text-xl font-light text-agm-gray'>
          Born in 1995, AGM has facilitated direct access to international stock 
          markets otherwise unavailable to certain investors. 
          We strive to innovate and lead the Latin American market 
          with our online investments app: AGM Trader, where you 
          can check your portfolio and expand it with over 150 markets at any time!
        </p>
        <Button variant={'default'} className='h-fit w-fit px-8 py-4 rounded-3xl'>
          <p className='text-sm font-bold'>Learn more.</p>
        </Button>
      </div>
    </div>
  )
}

export default Introduction