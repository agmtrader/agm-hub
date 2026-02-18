'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { formatURL } from '@/utils/language/lang'

const ModernTools = () => {
  const { t, lang } = useTranslationProvider()

  return (
    <div className="container flex flex-col gap-10 justify-center items-center">
      
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold tracking-tighter">{t('main.modern_tools.title')}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('main.modern_tools.description')}
        </p>
      </div>

      <Card className="w-[30%] h-full justify-center items-center">
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="text-2xl font-bold text-foreground">{t('main.modern_tools.risk_profile.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center gap-4">
          <p className="text-sm text-muted-foreground">{t('main.modern_tools.risk_profile.description')}</p>
          <Link href={formatURL('/risk', lang)}>
            <Button className="gap-2 w-fit">{t('main.modern_tools.risk_profile.button')} <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </CardContent>
      </Card>
    
    </div>
  )
}

export default ModernTools
