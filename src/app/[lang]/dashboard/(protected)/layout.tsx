'use client'
import React from 'react';
import { useSession } from 'next-auth/react';

import { AnimatePresence, motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import Account from '@/components/sidebar/Account';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default function Layout({
  children,
}: {
  children: React.ReactNode,
}) {

  const {data:session} = useSession()

  return (
    <div className='flex-col flex w-full justify-center items-center h-full'>
      <div className='flex w-full h-full'>

        {session?.user ?
          <div className='flex w-full h-full  justify-center items-center'>
            {session.user.admin ? 
              <AnimatePresence>
                <motion.div 
                  initial={{opacity:0}}
                  animate={{opacity:1}}
                  className='w-full h-full gap-x-10 flex justify-center items-start'
                >
                  {children}
                </motion.div>
              </AnimatePresence>
              :
              <motion.div key={2} initial={{opacity:0}} animate={{opacity:1}} className='w-full h-full flex flex-col justify-center items-center gap-y-5'> {/*No auth*/}
                <Dashboard />
              </motion.div>
            }
          </div>
          :
          <div className='w-full h-[60vh] text-agm-white flex flex-col justify-center items-center text-center gap-y-5'>
            <Lock size={100}/>
            <p className='text-7xl font-bold'>Locked out.</p>
            <p className='text-xl text-subtitle'> Sign in to access your personal dashboard.</p>
            <Account/>
          </div>
        }
        
      </div>
    </div>
  )
}