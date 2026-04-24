'use client'
import { motion } from 'framer-motion'
import { InteractiveOptionsLesson } from '@/components/hub/learning/InteractiveOptionsLesson'
import { LearningCarousel } from '@/components/hub/learning/LearningCarousel'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const LearningCenterPage = () => {
  const { t } = useTranslationProvider()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='h-full w-full py-24 flex flex-col justify-center items-center gap-16'
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
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className='w-full flex justify-center'
      >
        <InteractiveOptionsLesson />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className='w-full h-full py-4 justify-center items-center flex flex-col gap-6'
      >
        <div className='flex flex-col gap-2 justify-center items-center text-center px-4'>
          <h2 className='text-3xl font-semibold'>{t('learning.video_library_title')}</h2>
          <p className='text-subtitle max-w-2xl'>{t('learning.video_library_description')}</p>
        </div>
        <LearningCarousel />
      </motion.div>
    </motion.div>
  )
}

export default LearningCenterPage
