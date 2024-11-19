import React from 'react'
import { motion } from 'framer-motion'
import { HardHat } from 'lucide-react'
import { formatURL } from '@/utils/lang'
import { Button } from '../ui/button'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import Link from 'next/link'

const DevelopmentPage = () => {

    const { lang } = useTranslationProvider()

  return (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className='flex flex-col h-full justify-center items-center gap-5'
    >
        <HardHat size={100} className='text-foreground'/>
        <motion.p 
        className='text-7xl font-bold'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        >
        Still under development.
        </motion.p>
        <motion.p 
        className='text-xl text-subtitle'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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