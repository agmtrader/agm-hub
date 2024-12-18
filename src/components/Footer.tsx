'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { containerVariants, itemVariants } from '@/lib/anims'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Footer = () => {

  const { t } = useTranslationProvider()

  const socialIcons = [
    {
      icon: FaFacebook,
      href: 'https://www.facebook.com/agmtrader/'
    },
    {
      icon: FaInstagram,
      href: 'https://www.instagram.com/agmtrader/'
    },
    {
      icon: FaLinkedin,
      href: 'https://www.linkedin.com/company/agmtrader/'
    }
  ]

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
              <h3 className='font-bold mb-4'>{t('shared.footer.title')}</h3>
              <p className='text-sm text-foreground'>{t('shared.footer.copyright')}</p>
            </motion.div>
            
            {/* Product links */}
            <motion.div variants={itemVariants}>
              <h4 className='font-semibold mb-4'>{t('shared.footer.products')}</h4>
              <ul className='space-y-2'>
                {[t('shared.footer.download')].map((item, index) => (
                  <motion.li key={index} variants={itemVariants}>
                    <a href='#' className='text-sm text-foreground'>{item}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Help links */}
            <motion.div variants={itemVariants}>
              <h4 className='font-semibold mb-4'>{t('shared.footer.help_center')}</h4>
              <ul className='space-y-2'>
                {[t('shared.footer.more_faqs'), t('shared.footer.email_support')].map((item, index) => (
                  <motion.li key={index} variants={itemVariants}>
                    <a href='#' className='text-sm text-foreground'>{item}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Social links */}
            <motion.div variants={itemVariants}>
              <div className='flex flex-col gap-4'>
                {socialIcons.map(({ icon: Icon, href }, index) => (
                  <motion.a
                    key={index}
                    href={href}
                    className='text-secondary-light'
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
            className='mt-8 pt-8 border-t border-gray-200 flex flex-row items-center justify-between w-full'
            variants={itemVariants}
          >
            <div className='flex flex-wrap justify-between w-full items-center'>
              <div className='space-x-4'>
                <a href='/disclosures' className='text-sm text-foreground'>{t('shared.footer.terms_of_use')}</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer