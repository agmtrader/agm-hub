import React from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { Button } from '../ui/button'
import Link from 'next/link'
import { formatURL } from '@/utils/language/lang'

const NoPermissionsPage = () => {

  const { t, lang } = useTranslationProvider()

  return (
    <motion.div 
    className='flex flex-col w-full h-full items-center gap-5'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      className='flex flex-col h-full justify-center items-center gap-5'
    >
      <Lock size={100} className='text-foreground'/>
      <motion.p 
        className='text-7xl font-bold'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {t('protected.noPermissions')}
      </motion.p>
      <motion.p 
        className='text-xl text-subtitle'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {t('protected.noPermissionsMessage')}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button>
          <Link href={formatURL('/', lang)}>
            {t('protected.goBack')}
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  </motion.div>
  )
}

export default NoPermissionsPage