'use client'
import React from 'react'
import { Linkedin, Facebook, Instagram, Twitter, Discord } from 'react-bootstrap-icons'
import { motion } from 'framer-motion'

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  }

  const socialIconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 10,
      },
    },
  }

  return (
    <footer className='py-8'>
      <div className='container mx-auto px-4'>
        <motion.div
          className='max-w-[80%] mx-auto bg-background rounded-lg shadow-md p-8'
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Main footer content */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {/* Company info */}
            <motion.div variants={itemVariants}>
              <h3 className='font-bold mb-4'>AGM Trader Broker & Advisor</h3>
              <p className='text-sm text-gray-600 mb-4'></p>
              <p className='text-sm text-gray-600'>© 2023 AGM Trader Broker & Advisor, all rights reserved.</p>
            </motion.div>
            
            {/* Product links */}
            <motion.div variants={itemVariants}>
              <h4 className='font-semibold mb-4'>Product</h4>
              <ul className='space-y-2'>
                {['Download'].map((item, index) => (
                  <motion.li key={index} variants={itemVariants}>
                    <a href='#' className='text-sm text-gray-600 hover:text-gray-900'>{item}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Help links */}
            <motion.div variants={itemVariants}>
              <h4 className='font-semibold mb-4'>Help Center</h4>
              <ul className='space-y-2'>
                {['More FAQs', 'Email Support'].map((item, index) => (
                  <motion.li key={index} variants={itemVariants}>
                    <a href='#' className='text-sm text-gray-600 hover:text-gray-900'>{item}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Social links */}
            <motion.div variants={itemVariants}>
              <div className='flex flex-col space-y-2'>
                {[Linkedin, Instagram, Facebook].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href='#'
                    className='text-gray-600 hover:text-gray-900'
                    variants={socialIconVariants}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Bottom links */}
          <motion.div
            className='mt-8 pt-8 border-t border-gray-200 flex flex-row items-center justify-between w-full'
            variants={itemVariants}
          >
            <div className='flex flex-wrap justify-between w-full items-center'>
              <div className='space-x-4'>
                <a href='/disclosures' className='text-sm text-gray-600 hover:text-gray-900'>Terms of Use Agreement and Disclosures</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer