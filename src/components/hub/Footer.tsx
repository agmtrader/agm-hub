'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { containerVariants, itemVariants } from '@/lib/anims'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { formatURL } from '@/utils/language/lang'

const Footer = () => {

  const { t, lang } = useTranslationProvider()

  const socialIcons = [
    {
      icon: FaInstagram,
      href: 'https://www.instagram.com/agmbrokerad/'
    },
    {
      icon: FaLinkedin,
      href: 'https://www.linkedin.com/company/agm-trader-2001/'
    }
  ]

  return (
    <footer className='py-8'>
      <div className='container mx-auto px-4'>
        <motion.div
          className='w-full max-w-6xl mx-auto bg-background rounded-xl shadow-md p-5 sm:p-8'
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Main footer content */}
          <div className='flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center'>
            {/* Company info */}
            <motion.div variants={itemVariants}>
              <h3 className='font-bold mb-4'>{t('footer.title')}</h3>
              <p className='inline-flex min-h-10 items-center text-sm text-foreground'>{t('footer.copyright')}</p>
            </motion.div>
            
            {/* Social links */}
            <motion.div variants={itemVariants}>
              <div className='flex gap-4'>
                {socialIcons.map(({ icon: Icon, href }, index) => (
                  <motion.a
                    key={index}
                    href={href}
                    className='flex h-10 w-10 items-center justify-center rounded-md text-secondary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                    aria-label={href.includes('instagram') ? 'Instagram' : 'LinkedIn'}
                    variants={itemVariants}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Bottom links */}
          <motion.div
            className='mt-6 pt-6 border-t border-gray-200 flex items-center w-full'
            variants={itemVariants}
          >
            <div className='flex flex-wrap justify-between w-full items-center'>
              <div className='space-x-4'>
                <a href={formatURL('/disclosures', lang)} className='inline-flex min-h-10 items-center text-sm text-foreground'>{t('footer.terms_of_use')}</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer