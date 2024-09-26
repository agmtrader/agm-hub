import React from 'react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import Link from 'next/link'

const Title = () => {
  return (
    <div className='w-full h-screen bg-[url(/images/wall_street.jpg)] bg-cover bg-center z-1'>
      <div className='flex flex-col gap-y-5 z-10 justify-center items-center h-screen text-center w-full text-4xl text-agm-white font-medium'> 
        <Image src={'/images/brand/agm-logo-white.png'} alt = 'AGM Logo' height = {100} width = {300}/>
        <p className='text-md text-white'>Access to Global Markets</p>
        <Link href='/apply' rel="noopener noreferrer" target="_blank">
          <Button asChild>
            <p className='text-sm font-bold'>Open an account.</p>
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Title