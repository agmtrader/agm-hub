'use client'
import React from 'react';
import { useSession } from 'next-auth/react';

import { AnimatePresence, motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import Account from '@/components/misc/Account';
import LoadingComponent from '@/components/misc/LoadingComponent';
import FirebaseAuthProvider from '@/utils/providers/FirebaseAuthProvider';

export default function Layout({
  children,
}: {
  children: React.ReactNode,
}) {

  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <LoadingComponent className='w-full h-full'/>
    );
  }

  return (
    <FirebaseAuthProvider>
      {session?.user ?
        <>
          <AnimatePresence>
            <motion.div 
              initial={{opacity:0}}
              animate={{opacity:1}}
              className='flex flex-col w-full h-full'
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </>
        :
        <motion.div 
          className='flex flex-col w-full h-full items-center gap-5'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className='flex flex-col h-full justify-center items-center gap-5'
          >
            <Lock size={100} className='text-foreground'/>
            <motion.p 
              className='text-7xl font-bold'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Locked out
            </motion.p>
            <motion.p 
              className='text-xl text-subtitle'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Sign in to access AGM Client features.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Account/>
            </motion.div>
          </motion.div>
        </motion.div>
      }
    </FirebaseAuthProvider>
  )
}
