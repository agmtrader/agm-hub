'use client'
import Fees from '@/components/hub/fees/Fees'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import React from 'react'

const page = () => {
  const { t } = useTranslationProvider()
  return (
    <div className="container flex flex-col py-6 gap-8 justify-center items-center">
        {/* Title & description */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">{t('fees.title')}</h1>
        <p className="text-muted-foreground max-w-2xl">{t('fees.description')}</p>
      </div>
      <Fees />
    </div>
  )
}

export default page