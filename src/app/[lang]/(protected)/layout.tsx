'use client'
import React from 'react';
import { useSession } from 'next-auth/react';

import { AnimatePresence, motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import Account from '@/components/misc/Account';
import LoadingComponent from '@/components/misc/LoadingComponent';
import FirebaseAuthProvider from '@/utils/providers/FirebaseAuthProvider';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import LockedOutPage from '@/components/misc/LockedOutPage';

export default function Layout({
  children,
}: {
  children: React.ReactNode,
}) {

  const { data: session, status } = useSession();
  const { t } = useTranslationProvider()

  if (status === 'loading') {
    return (
      <LoadingComponent className='w-full h-full'/>
    )
  }

  return (
    <FirebaseAuthProvider>
      {session?.user ?
        <AnimatePresence>
          <motion.div 
            initial={{opacity:0}}
            animate={{opacity:1}}
            className='flex flex-col w-full h-full'
          >
            {children}
          </motion.div>
        </AnimatePresence>
        :
        <LockedOutPage/>
      }
    </FirebaseAuthProvider>
  )
}
