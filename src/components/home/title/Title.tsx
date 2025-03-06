'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import ShimmerButton from '@/components/ui/shimmer-button'
import { formatURL } from '@/utils/language/lang'

interface TitleProps {
  backgroundImage: string;
  logoSrc: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const Title: React.FC<TitleProps> = ({
  backgroundImage,
  logoSrc,
  title,
  subtitle,
  ctaText,
  ctaLink
}) => {

  const { t, lang
    
   } = useTranslationProvider()
  return (
    <div className='w-full h-screen bg-blue-900 relative overflow-hidden'>
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: 'easeOut' }}
        className='absolute inset-0'
      >
        <Image
          src={backgroundImage}
          alt='Background'
          fill
          priority
          className='object-cover'
        />
      </motion.div>
      <div className='absolute inset-0 bg-black bg-opacity-50' />
      <div className='flex flex-col gap-y-8 z-10 justify-center items-center h-screen text-center w-full text-background font-medium relative px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image src={logoSrc} alt='AGM Logo' style={{width: 'auto', height: 'auto'}} height={150} width={450} />
        </motion.div>
        <motion.h1 
          className='text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-tight'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h1>
        <motion.p 
          className='text-lg md:text-xl lg:text-2xl mb-6 max-w-2xl'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href={formatURL(ctaLink, lang)} rel="noopener noreferrer" target="_blank">
            <ShimmerButton
              className="px-8 py-3 text-lg font-semibold mt-4"
              background='#f26c0d'
            >
                <p className="text-sm">{ctaText}</p>
            </ShimmerButton>
          </Link>
        </motion.div>
      </div>
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-background text-center"
        >
          <p className="text-lg mb-2 whitespace-nowrap">{t('shared.title.scroll_text')}</p>
          <svg className="w-6 h-6 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
    </div>
  )
}

export default Title
