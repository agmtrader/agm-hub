'use client'
import React, { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import Sidebar from '@/components/dashboard/sidebar/Sidebar';
import Account from '@/components/sidebar/Account';
import { ClientDashboard } from '@/components/dashboard/Dashboard';

export default function Layout({
  children,
}: {
  children: React.ReactNode,
}) {

  const {data:session} = useSession()
  if (session)
  console.log(session?.firebaseToken)
  return (
      <div className='h-full w-full flex flex-col items-start justify-start'>
        <div className='w-full h-full flex justify-start'>
            <div className='flex-col my-20 flex w-full h-full'>
              <div className='flex w-full h-full'>

                {session?.user ?
                  <div className='flex w-full h-full justify-center items-center'>
                    {session.user.admin ? 
                      <AnimatePresence>
                        <motion.div 
                          initial={{opacity:0}}
                          animate={{opacity:1}}
                          className='w-[90%] h-full flex justify-center items-center'
                        >
                          {children}
                        </motion.div>
                      </AnimatePresence>
                      :
                      <motion.div key={2} initial={{opacity:0}} animate={{opacity:1}} className='w-[90%] h-full flex flex-col justify-center items-center gap-y-5'> {/*No auth*/}
                        <ClientDashboard />
                      </motion.div>
                    }
                  </div>
                  :
                  <div className='w-full h-[60vh] flex flex-col justify-center items-center text-center gap-y-5'>
                    <Lock size={100}/>
                    <p className='text-7xl font-bold'>Oops!</p>
                    <p className='text-xl text-subtitle'> Sign in to access your personal dashboard.</p>
                    <Account/>
                  </div>
                }
                
              </div>
            </div>
        </div>
      </div>
  )
}