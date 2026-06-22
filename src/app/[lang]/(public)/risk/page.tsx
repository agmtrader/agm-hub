'use client'
import Header from '@/components/hub/Header'
import RiskForm from '@/components/hub/risk/RiskForm'
import { containerVariants } from '@/lib/anims'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { motion } from 'framer-motion'
import React from 'react'

const page = () => {

  const {t} = useTranslationProvider()

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className='w-full flex flex-col h-full'
    >
      <div className="w-full flex flex-col gap-8 py-10">
        <div className="mx-auto w-full max-w-[1680px] px-6 2xl:px-10">
          <h2 className="text-5xl font-semibold text-center mb-4">
            {t('risk.title')}
          </h2>
          <p className="text-center text-muted-foreground">
            {t('risk.description')}
          </p>
        </div>
        <div className="mx-auto w-full max-w-[1680px] px-4 sm:px-6 2xl:px-10">
          <RiskForm/>
        </div>
      </div>
    </motion.div>
  )
}

export default page
