"use client"
import React, {useState, useEffect} from 'react';
import { useSession } from 'next-auth/react';
import Dashboard from '@/components/dashboard/Dashboard';

const page = () => {

  const {data:session} = useSession()
  
  return (
    <div className='w-full h-full flex '>

      <div className="flex flex-row w-[100vw] justify-center items-start h-full gap-y-36 bg-[#2571A5]"> {/*BG*/}
        
        {session?.user ?

          (session?.user.email && session.user.email.split('@')[1] === 'agmtechnology.com') ?
            <Dashboard user={session?.user}/>
            :
            <div className='w-[100vw] h-[100vh]'>
              <p>Client mode</p>
            </div>  
          :
          <div className='w-[100vw] h-[100vh]'>
            <p>Log in to view!</p>
          </div>   
        }

      </div>
      
    </div>
  )
}

export default page