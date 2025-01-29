'use client'
import { motion } from 'framer-motion'
import { ResourceCarousel } from '@/components/resources/ResourceCarousel'

const ResourceCenterPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='h-full w-full my-32 gap-10 flex flex-col'
    >
      <div className='flex flex-col gap-10 justify-start items-center'>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-5xl font-bold'
        >
          Resource Center
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='text-lg text-subtitle'
        >
          Check out our videos to learn about international markets and trading.
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className='w-full h-full py-4 justify-center items-center flex'
      >
        <ResourceCarousel />
      </motion.div>
    </motion.div>
  )
}

export default ResourceCenterPage
