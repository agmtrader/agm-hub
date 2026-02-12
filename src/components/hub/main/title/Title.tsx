'use client'
import { CandlesBackground } from '@/components/ui/candles-background'
import React from 'react' 
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Globe } from '@/components/ui/globe'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const Title = () => {

  const { t } = useTranslationProvider();

  return (
    <div className="relative">
        <div className="absolute inset-0 z-10 pointer-events-none">
            <CandlesBackground />
        </div>
        <div className="container relative z-20">
            <div className="h-full w-full flex p-20">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-6xl font-bold tracking-tighter text-foreground">
                        {t('main.title.empowering_traders')} {" "}
                        <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                        {t('main.title.worldwide')}
                        </span>
                    </h1>
                    <p className="text-foreground text-xl">
                        {t('main.title.description')}
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                        <Check className="text-secondary h-5 w-5" />
                        <span className="text-md">
                            {t('main.title.trade_stocks')}
                        </span>
                    </div>

                    <div className="flex items-start gap-3">
                        <Check className="text-secondary h-5 w-5" />
                        <span className="text-md">
                            {t('main.title.currencies_and_markets')}
                        </span>
                    </div>

                    <div className="flex items-start gap-3">
                        <Check className="text-secondary h-5 w-5" />
                        <span className="text-md">
                            {t('main.title.customer_support_and_reporting')}
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="gap-2">
                        {t('shared.apply_for_an_account')} <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline">
                        {t('shared.view_requirements')}
                    </Button>
                </div>
            </div>
                <div className="relative hidden lg:flex items-center justify-center min-h-[520px]">
                    <Globe size={520} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Title