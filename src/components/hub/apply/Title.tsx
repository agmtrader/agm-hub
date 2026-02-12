'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { containerVariants, itemVariants } from '@/lib/anims'
import Link from 'next/link'
import { formatURL } from '@/utils/language/lang'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { CandlesBackground } from '@/components/ui/candles-background'

interface Props {
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
}

const Title = ({ setStarted }: Props) => {
  const { t, lang } = useTranslationProvider()

  return (
    <div className='relative w-full h-[calc(100vh-80px)] flex flex-col justify-center items-center overflow-hidden bg-background'>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className='z-10 flex flex-col gap-y-8 justify-center items-center text-center px-4 max-w-4xl'
        >
          <motion.h1 variants={itemVariants} className='text-5xl md:text-7xl font-bold tracking-tighter text-foreground'>
            {t('apply.account.title.ready')}
          </motion.h1>
          
          <motion.p variants={itemVariants} className='text-xl md:text-2xl text-muted-foreground max-w-2xl'>
            {t('apply.account.title.description')}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
            <Button
              size="lg"
              onClick={() => setStarted(true)}
              className="px-8 py-6 text-lg font-semibold gap-2"
            >
                {t('apply.account.title.startApplication')} <ArrowRight className="w-5 h-5" />
            </Button>

            <p className='text-sm text-muted-foreground'>
              {t('apply.account.title.get_started')} <Link href={formatURL('/requirements', lang)} className='text-primary hover:underline underline-offset-4 font-medium'>{t('apply.account.title.get_started_link')}</Link>.
            </p>
          </motion.div>
        </motion.div>
    </div>
  )
}

export default Title
