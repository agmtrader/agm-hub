'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'

type Props = {}

const NotFound = (props: Props) => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-y-3">
      <motion.h1 
        className="text-9xl font-extrabold text-red-600"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        404
      </motion.h1>
      <motion.p 
        className="text-2xl font-semibold text-foreground mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Page Not Found
      </motion.p>
      <motion.p 
        className="text-lg text-subtitle mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Sorry, the page you are looking for does not exist.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </motion.div>
    </div>
  )
}

export default NotFound