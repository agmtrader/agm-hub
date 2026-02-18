import React from 'react'
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
            <div className='flex flex-wrap justify-center gap-x-8 gap-y-3 max-w-2xl'>
                <span className='text-2xl font-semibold text-foreground'>
                    {t('main.about.assets.0')}
                </span>
                <span className='text-2xl font-semibold text-foreground'>
                    {t('main.about.assets.1')}
                </span>
                <span className='text-2xl font-semibold text-foreground'>
                    {t('main.about.assets.2')}
                </span>
                <span className='text-2xl font-semibold text-foreground'>
                    {t('main.about.assets.3')}
                </span>
                <span className='text-2xl font-semibold text-foreground'>
                    {t('main.about.assets.4')}
                </span>
                <span className='text-2xl font-semibold text-foreground'>
                    {t('main.about.assets.5')}
                </span>
            </div>
            <div className='max-w-3xl flex flex-col gap-4'>
                <p className='text-lg text-center text-foreground'>
                    {t('main.about.description')}
                </p>
                <p className='text-lg text-center text-foreground'>
                    {t('main.about.description_2')}
                </p>
            </div>
        </div>
        <Iphone15Pro className='h-[40rem]' src='/assets/products/iphone-app.png' style={{ transform: 'perspective(1000px) rotateY(-15deg) rotateZ(0deg)' }} />
    </div>
  )
}

export default About