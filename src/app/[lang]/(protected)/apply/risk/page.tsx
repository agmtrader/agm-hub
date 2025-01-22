'use client'
import RiskForm from '@/components/apply/risk/RiskForm'
import { FormHeader } from '@/components/Header'
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
      <FormHeader />
      <div className="w-full flex flex-col gap-10 py-10 justify-center items-center">
        <h2 className="text-5xl font-semibold text-center mb-4">
          {t('apply.risk.title')}
        </h2>
        <p className="text-center text-muted-foreground">
          {t('apply.risk.description')}
        </p>
        <div className="w-full max-w-4xl">
          <RiskForm/>
        </div>
      </div>
    </motion.div>
  )
}

export default page