"use client"
import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import Dashboard from '@/components/dashboard/Dashboard';
import Account from '@/components/sidebar/Account';
import { Button } from '@/components/ui/button';

const page = () => {

  const {data:session} = useSession()
  
  return (
    <div className='w-full h-full flex'>

      <div className="flex flex-row w-full px-10 justify-center items-start h-full gap-y-10"> {/*BG*/}
        
        {session?.user ?
        
          <Dashboard user={session?.user}/> 
          :
          <div className='w-full flex flex-col gap-y-10 justify-center items-center h-[100vh]'>
            <p className='text-7xl text-white font-bold'>Sign in to view our dashboard.</p>
            <Button onClick={(e) => {
              e.preventDefault()
              signIn('google')
              }}
              className="flex"
            >
                <p className="text-sm">Sign in</p>
            </Button>
          </div>
          
        }

      </div>
      
    </div>
  )
}

export default page