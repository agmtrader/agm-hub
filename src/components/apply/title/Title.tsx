import React from 'react'
import { Button } from "@/components/ui/button"

interface Props {
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
}

const Title = ({setStarted}: Props) => {
  return (
    <div className='flex bg-[url(/images/bull.jpg)] relative flex-row h-[100vh] w-full bg-cover bg-center justify-between items-center z-0 gap-x-5'>
      <div className='w-full h-full opacity-40 bg-agm-accent-dark absolute z-1'></div>
      <div className='flex flex-col gap-y-10 z-10 justify-center items-center text-center h-[60vh] w-full text-4xl text-agm-white font-medium'> 
        <p className='text-7xl font-bold'>Account Application Form</p>
        <Button variant={'secondary'} onClick={() => setStarted(true)} className='h-fit w-fit px-8 py-4 rounded-3xl'>
          <p className='text-sm font-bold'>Get started.</p>
        </Button>
      </div>
    </div>
  )
}

export default Title