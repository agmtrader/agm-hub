'use client'
import { motion } from 'framer-motion'
import { LearningCarousel } from '@/components/hub/learning/LearningCarousel'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const LearningCenterPage = () => {
  const { t } = useTranslationProvider()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='h-full w-full py-24 flex flex-col justify-center items-center'
    >
      <div className='flex flex-col gap-5 justify-center items-center'>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-5xl font-bold'
        >
          {t('learning.title')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='text-lg text-subtitle'
        >
          {t('learning.description')}
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className='w-full h-full py-4 justify-center items-center flex'
      >
        <LearningCarousel />
      </motion.div>
    </motion.div>
  )
}

export default LearningCenterPage
