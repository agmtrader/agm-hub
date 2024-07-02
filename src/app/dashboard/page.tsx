"use client"
import React from 'react';
import { useSession } from 'next-auth/react';
import Dashboard from '@/components/dashboard/Dashboard';

const page = () => {

  const {data:session} = useSession()
  
  return (
    <div className='w-full h-full flex '>

      <div className="flex flex-row w-[100vw] justify-center items-start h-full gap-y-36 bg-[#2571A5]"> {/*BG*/}
        
        {session?.user ?
        
          <Dashboard user={session?.user}/> 
          :
          <div className='w-[100vw] flex justify-center items-center h-[100vh]'>
            <p className='text-7xl text-white font-bold'>Log in to view!</p>
          </div>   
        }

      </div>
      
    </div>
  )
}

export default page