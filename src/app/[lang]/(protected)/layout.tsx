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
import { formatURL } from '@/utils/lang';
import { redirect } from 'next/navigation';

export default function Layout({
  children,
}: {
  children: React.ReactNode,
}) {

  const { data: session, status } = useSession();
  const { lang } = useTranslationProvider()

  if (status === 'loading') {
    return (
      <LoadingComponent className='w-full h-full'/>
    )
  }

  if (!session?.user) {
    redirect(formatURL('/signin', lang))
  }

  return (
    <FirebaseAuthProvider>
      {session?.user &&
        <AnimatePresence>
          <motion.div 
            initial={{opacity:0}}
            animate={{opacity:1}}
            className='flex flex-col w-full h-full'
          >
            {children}
          </motion.div>
        </AnimatePresence>
      }
    </FirebaseAuthProvider>
  )
}
