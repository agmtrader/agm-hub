import React from 'react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import Link from 'next/link'

const Title = () => {
  return (
    <div className='flex bg-[url(/images/nyse.jpg)] relative flex-row h-[100vh] w-full bg-cover bg-center justify-between items-center z-0 gap-x-5'>
      <div className='w-full h-full opacity-40 bg-[#001A4C] absolute z-1'></div>
      <div className='flex flex-col gap-y-5 z-10 justify-center items-center text-center h-[60vh] w-full text-4xl text-agm-white font-medium'> 
        <Image src={'/images/brand/agm-logo-white.png'} alt = 'AGM Logo' height = {300} width = {300}/>
        <p className='text-sm text-white'>Access to Global Markets</p>
        <Link href='/apply'>
          <Button asChild>
            <p className='text-sm font-bold'>Open an account.</p>
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Title