'use client'


import RiskForm from '@/components/apply/risk/RiskForm'
import { FormHeader } from '@/components/Header'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import React from 'react'

const page = () => {
  const {t} = useTranslationProvider()

  return (
    <div className='w-full flex flex-col h-full'>
      <FormHeader />
      <div className="w-full max-w-4xl gap-y-20 flex flex-col mx-auto px-4 py-6">
        <div>
          <h2 className="text-5xl font-semibold text-center mb-4">{t('apply.risk.title')}</h2>
          <p className="text-center text-muted-foreground">
            {t('apply.risk.description')}
          </p>
        </div>
        <RiskForm/>
      </div>
    </div>
  )
}

export default page