'use client'
import React from 'react';
import { useSession } from 'next-auth/react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingComponent from '@/components/misc/LoadingComponent';
import FirebaseAuthProvider from '@/utils/providers/FirebaseAuthProvider';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { formatURL } from '@/utils/lang';
import { useRouter, usePathname } from 'next/navigation';

export default function Layout({
  children,
}: {
  children: React.ReactNode,
}) {

  const { data: session, status } = useSession();
  const { lang } = useTranslationProvider()
  const router = useRouter()
  const pathname = usePathname()

  if (status === 'loading') {
    return (
      <LoadingComponent className='w-full h-full'/>
    )
  }

  if (!session?.user) {
    router.push(formatURL(`/signin?callbackUrl=${encodeURIComponent(pathname)}`, lang))
    return null
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
