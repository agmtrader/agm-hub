import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { motion } from 'framer-motion'
import ShimmerButton from '@/components/ui/shimmer-button'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { redirect } from 'next/navigation'
import { formatURL } from '@/utils/lang'
import { containerVariants, itemVariants } from '@/lib/anims'
import PreviousApplications from './PreviousApplications'
import { Ticket } from '@/lib/types'
interface Props {
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>
}

const Title = ({setStarted, setTicket}:Props) => {

  const {t, lang} = useTranslationProvider()

  function handleStartApplication() {
    setStarted(true)
  }

  return (
    <div className='w-full h-screen flex flex-col'>
      <Header/>
      <div className='flex-1 flex flex-col gap-y-10 bg-[url(/assets/backgrounds/bull.jpg)] w-full bg-cover bg-center z-0 justify-center items-center relative overflow-hidden'>
        <div className='w-full h-full opacity-60 bg-secondary-dark absolute z-1'></div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className='flex w-full gap-x-5 justify-center items-center'
          >
          </motion.div>
          <motion.div variants={itemVariants}>
            <ShimmerButton
              onClick={handleStartApplication}
              className="px-8 py-3 text-lg font-semibold mt-4"
              background='#22c55e'
            >
                <p className="text-sm">{t('apply.account.title.startApplication')}</p>
            </ShimmerButton>
          </motion.div>
          <motion.div variants={itemVariants}>
            <PreviousApplications setTicket={setTicket} setStarted={setStarted}/>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Title