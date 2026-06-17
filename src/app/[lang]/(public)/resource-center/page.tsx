'use client'

import { motion } from 'framer-motion'

import { LearningCarousel } from '@/components/hub/learning/LearningCarousel'
import { ResourceCarousel } from '@/components/hub/learning/ResourceCarousel'
import { resourceCenterSections } from '@/lib/public/resource-center'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const ResourceCenterPage = () => {
  const { t } = useTranslationProvider()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full w-full py-24 flex flex-col justify-start items-center gap-14"
    >
      <div className="flex flex-col gap-5 justify-center items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center"
        >
          {t('learning.title')}
        </motion.h1>
      </div>

      <div className="w-full flex flex-col gap-14 items-center">
        {resourceCenterSections.map((section, index) => (
          <motion.section
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.45 }}
            className="w-full flex flex-col gap-6 items-center"
          >
            <div className="flex flex-col gap-2 justify-center items-center px-6 text-center">
              <h2 className="text-3xl font-semibold">{t(section.titleKey)}</h2>
              <p className="text-subtitle max-w-2xl">{t(section.descriptionKey)}</p>
            </div>
            {section.id === 'learning' ? (
              <LearningCarousel />
            ) : (
              <ResourceCarousel slides={section.slides} />
            )}
          </motion.section>
        ))}
      </div>
    </motion.div>
  )
}

export default ResourceCenterPage
