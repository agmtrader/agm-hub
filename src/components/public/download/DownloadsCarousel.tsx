"use client"
import * as React from "react"
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Download as DownloadIcon } from 'lucide-react'
import { FaApple, FaLinux, FaWindows, FaAndroid } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import Link from "next/link"
import { formatURL } from "@/utils/language/lang"

export enum osTypes {
  WINDOWS = 0,
  LINUX = 1,
  MACOS = 2,
  ANDROID = 3,
  IOS = 4
}


function DownloadsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    slidesToScroll: 1,
  })

  const { t, lang } = useTranslationProvider()

  const apps = [
    {
      name: 'AGM Trader Pro',
      title: 'Professional Trading Platform',
      description: t('agm-trader.download.title'),
      icon: '/assets/brand/agm-logo-circle.png',
      download_url: '/downloads/trader',
      platforms: [
        { type: 'Windows', icon: FaWindows, osType: osTypes.WINDOWS },
        { type: 'Mac', icon: FaApple, osType: osTypes.MACOS },
        { type: 'Linux', icon: FaLinux, osType: osTypes.LINUX },
      ]
    },
    {
      name: 'AGM Trader Mobile',
      title: 'Mobile Trading Platform',
      description: t('agm-trader.download.title'),
      icon: '/assets/brand/agm-logo-circle.png',
      download_url: '/downloads/mobile',
      platforms: [
        { type: 'Android', icon: FaAndroid, osType: osTypes.ANDROID },
        { type: 'iOS', icon: FaApple, osType: osTypes.IOS },
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  }

  return (
    <motion.div 
      className='flex flex-col text-foreground justify-center text-center items-center h-full p-10 gap-y-10 w-full'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      id='download'
    >
      <motion.h2 className='text-5xl font-bold' variants={itemVariants}>
        {t('products.download.title')}
      </motion.h2>
      
      <motion.p className='text-xl font-light max-w-2xl' variants={itemVariants}>
        {t('products.download.description')}
      </motion.p>

      <motion.div 
        className="w-full flex justify-center items-center h-full max-w-[90%] md:max-w-[80%] lg:max-w-[65%] relative"
        variants={itemVariants}
      >
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md absolute left-0 z-10"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="overflow-hidden w-full" ref={emblaRef}>
          <div className="flex">
            {apps.map((app, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 px-4">
                <div className="p-1 group">
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center p-8 h-full space-y-6">
                      <div className="w-full text-foreground text-center flex flex-col items-center justify-center space-y-6">
                        {/* App Icon and Info */}
                        <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                          <img 
                            src={app.icon} 
                            alt={app.name}
                            className="w-20 h-20 object-contain"
                          />
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-2">
                          <h3 className="text-2xl font-bold">{app.name}</h3>
                          <div className="flex items-center justify-center gap-x-6">
                            {app.platforms.map((platform, index) => (
                              <div key={index} className="flex items-center justify-center">
                                <platform.icon className="h-4 w-4 text-primary" />
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-subtitle mt-1">{app.title}</p>
                        </div>

                        <Link href={formatURL(app.download_url, lang)} className="w-fit">
                          <Button className="w-fit flex gap-2">
                            <DownloadIcon className="h-4 w-4" />
                            {t('agm-trader.download.download_now')}
                          </Button>
                        </Link>
                        
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md absolute right-0 z-10"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default DownloadsCarousel