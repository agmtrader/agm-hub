"use client"
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import Image from 'next/image'

const page = () => {
  const {data:session} = useSession() 

  return (
    <div className='w-full h-full gap-y-5 flex flex-col justify-center items-center'>
      <div className='flex items-center gap-5'>
        {session?.user.image ? 
          <Image className='rounded-full' src={session?.user.image} alt="User Avatar" width={100} height={100} /> 
          : 
          <div className='w-32 h-32 bg-gray-200 rounded-full' />
        }
        <p className='text-7xl font-bold'>{session?.user.name ? session?.user.name : 'No name'}</p>
      </div>

      <p className='text-xl font-semibold'>{session?.user.email ? session?.user.email : 'No email'}</p>
      <p className='text-xl'>{session?.user.scopes?.includes('all') ? 'Admin' : 'User'}</p>

      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  )
}

export default page