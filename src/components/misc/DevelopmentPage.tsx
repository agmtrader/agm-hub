import React from 'react'
import { motion } from 'framer-motion'
import { HardHat } from 'lucide-react'
import { formatURL } from '@/utils/language/lang'
import { Button } from '../ui/button'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import Link from 'next/link'

const DevelopmentPage = () => {

    const { lang } = useTranslationProvider()

  return (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className='flex flex-col h-full justify-center text-center items-center gap-5'
    >
        <HardHat size={100} className='text-foreground'/>
        <motion.p 
        className='text-7xl font-bold'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        >
        Still under development.
        </motion.p>
        <motion.p 
        className='text-xl text-subtitle'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        >
        Check back soon to access the full platform.
        </motion.p>
        <Button>
          <Link href={formatURL('/', lang)}>
            Go to home
          </Link>
        </Button>
    </motion.div>
  )
}

export default DevelopmentPage