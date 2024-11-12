import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Header } from '@/components/Header'
import { signIn, useSession } from 'next-auth/react'
import { motion } from 'framer-motion' // Add this import
import ShimmerButton from '@/components/ui/shimmer-button'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import Account from '@/components/sidebar/Account'

interface Props {
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
}

const Title = ({setStarted}:Props) => {
  const {data:session} = useSession()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  }

  const {lang, t} = useTranslationProvider()

  return (
    <div className='w-full h-screen flex flex-col'>
      <Header/>
      <div className='flex-1 flex flex-col gap-y-10 bg-[url(/images/bull.jpg)] w-full bg-cover bg-center z-0 justify-center items-center relative overflow-hidden'>
        <div className='w-full h-full opacity-60 bg-primary-dark absolute z-1'></div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className='z-10 flex flex-col gap-y-8 justify-center items-center text-center px-4'
        >
          <motion.h1 variants={itemVariants} className='text-6xl md:text-7xl font-bold text-background'>
            {t('apply.account.title.ready')}
          </motion.h1>
          <motion.p variants={itemVariants} className='text-2xl md:text-3xl text-background max-w-2xl'>
            {t('apply.account.title.description')}
          </motion.p>
          {!session?.user ? 
            <Account />
            :
            <motion.div variants={itemVariants}>
              <ShimmerButton
                onClick={() => setStarted(true)}
                className="px-8 py-3 text-lg font-semibold mt-4"
                background='#22c55e'
              >
                {t('apply.account.title.startApplication')}
              </ShimmerButton>
            </motion.div>
          }
        </motion.div>
      </div>
    </div>
  )
}

export default Title