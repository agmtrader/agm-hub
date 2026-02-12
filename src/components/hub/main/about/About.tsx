import { BarChart2, LineChart, Globe2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import Link from 'next/link'
import { formatURL } from '@/utils/language/lang'
import { Button } from '@/components/ui/button'
import Iphone15Pro from '@/components/ui/iphone-15-pro'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const About = () => {

  const { t } = useTranslationProvider();

  return (
    <div className='container w-full flex justify-center items-center gap-20'>
        <div className="flex flex-col gap-10 justify-center items-center">
            <h2 className="text-5xl font-bold tracking-tighter text-center text-foreground">
                {t('main.about.title')}
            </h2>
            <div className='max-w-3xl flex flex-col gap-4'>
                <p className='text-lg text-center text-foreground'>
                    {t('main.about.description')}
                </p>
                <p className='text-lg text-center text-foreground'>
                {t('main.about.description_2')}
                </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                <CardContent className="p-6 space-y-2">
                    <BarChart2 className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">{t('main.about.trade_anytime_anywhere.title')}</h3>
                    <p className="text-sm text-foreground">
                    {t('main.about.trade_anytime_anywhere.description')}
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardContent className="p-6 space-y-2">
                    <LineChart className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">{t('main.about.professional_tools.title')}</h3>
                    <p className="text-sm text-foreground">
                    {t('main.about.professional_tools.description')}
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardContent className="p-6 space-y-2">
                    <Globe2 className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">{t('main.about.active_customer_support.title')}</h3>
                    <p className="text-sm text-foreground">
                    {t('main.about.active_customer_support.description')}
                    </p>
                </CardContent>
                </Card>
            </div>
        </div>
        {<Iphone15Pro className='h-[40rem]' src='/assets/phone/iphone-app.png' style={{ transform: 'perspective(1000px) rotateY(-15deg) rotateZ(0deg)' }} />}
    </div>
  )
}

export default About