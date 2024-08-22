import React from 'react'
import { Button } from "@/components/ui/button"
import Account from '@/components/sidebar/Account'
import { DashboardHeader } from '@/components/Header'

interface Props {
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
}

const Title = ({setStarted}: Props) => {
  return (
    <div className='flex fkle bg-[url(/images/bull.jpg)] relative flex-col h-[100vh] w-full bg-cover bg-center justify-between items-center z-0 gap-x-5'>
      <DashboardHeader/>
      <div className='w-full h-full opacity-40 bg-agm-accent-dark absolute z-1'></div>
      <div className='flex flex-col gap-y-10 z-10 justify-start text-center items-center w-full h-full text-4xl text-agm-white font-medium'> 
        <p className='text-7xl font-bold'>Account Application Form</p>
        <Button onClick={() => setStarted(true)}>Get started</Button>
      </div>
    </div>
  )
}

export default Title