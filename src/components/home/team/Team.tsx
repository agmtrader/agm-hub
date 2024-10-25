'use client'
import React, { useRef } from 'react'
import { TeamCarousel } from './Carousel'
import { Button } from '@/components/ui/button'
import { motion, useInView } from 'framer-motion'

type Props = {}

const Team = (props: Props) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div 
      ref={ref}
      className='h-fit w-full text-foreground flex flex-col justify-center gap-y-10 items-center'
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.8 }}
    >
      <motion.p 
        className='text-5xl font-bold'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Meet Our Team
      </motion.p>
      <motion.p 
        className='text-center text-lg'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Our team is dedicated to providing you with the best service possible.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className='w-full h-full py-4 justify-center items-center flex'
      >
        <TeamCarousel/>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Button>Contact us.</Button>
      </motion.div>
    </motion.div>
  )
}

export default Team