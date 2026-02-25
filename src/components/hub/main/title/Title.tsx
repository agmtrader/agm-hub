'use client'
import { CandlesBackground } from '@/components/ui/candles-background'
import React from 'react' 
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Globe } from '@/components/ui/globe'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { formatURL } from '@/utils/language/lang'

const Title = () => {

  const { t, lang } = useTranslationProvider();

  return (
    <div className="relative">
        <div className="absolute inset-0 z-10 pointer-events-none">
            <CandlesBackground />
        </div>
        <div className="container relative z-20">
            <div className="h-full w-full flex flex-col lg:flex-row p-4 md:p-10 lg:p-20 gap-10 lg:gap-32 justify-center items-center">
                <div className="flex flex-col gap-4 z-20">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground text-center lg:text-left">
                            {t('main.title.empowering_traders')} {" "}
                            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                            {t('main.title.worldwide')}
                            </span>
                        </h1>
                        <p className="text-foreground text-lg md:text-2xl text-center lg:text-left">
                            {t('main.title.description')}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                        <Link href={formatURL('/apply', lang)} target='_blank' rel='noopener noreferrer'>
                        <Button size="lg" className="gap-2">
                            {t('shared.apply_for_an_account')} <ArrowRight className="h-4 w-4" />
                        </Button>
                        </Link>
                        <Link href={formatURL('/requirements', lang)} target='_blank' rel='noopener noreferrer'>
                            <Button size="lg" variant="outline">
                                {t('shared.view_requirements')}
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="relative flex items-center justify-center w-full max-w-[300px] md:max-w-[400px] lg:max-w-[520px] aspect-square">
                    <Globe />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Title