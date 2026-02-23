"use client"
import * as React from "react"
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Download as DownloadIcon, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import Link from "next/link"
import { formatURL } from "@/utils/language/lang"
import { products } from "@/lib/public/products"
import IPad from "@/components/ui/ipad"
import Iphone15Pro from "@/components/ui/iphone-15-pro"
import Macbook from "@/components/ui/macbook"
import DualMonitor from "@/components/ui/dual-monitor"

const Products = () => {

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    slidesToScroll: 1,
  })

  const { t, lang } = useTranslationProvider()

  const apps = products(t)

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
        {t('main.products.title')}
      </motion.h2>
      
      <motion.p className='text-xl font-light max-w-2xl' variants={itemVariants}>
        {t('main.products.description')}
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
                        {/* Device Preview */}
                        {index === 0 ? (
                          <div className="flex items-end justify-center">
                            <DualMonitor width={1015} height={475} srcLeft={'/assets/products/trader-pro-left.png'} srcRight={'/assets/products/trader-pro-right.png'} />
                          </div>
                        ) : index === 1 ? (
                          <div className="flex items-end justify-center gap-6">
                            <div className="relative" style={{ width: 668, height: 481 }}>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90">
                                <IPad width={481} height={668} src={'/assets/products/mobile-app.png'} />
                              </div>
                            </div>
                            <Iphone15Pro width={244} height={481} src={'/assets/products/iphone-app.png'} />
                          </div>
                        ) : (
                          <div className="flex items-end justify-center">
                            <Macbook width={793} height={512} src={'/assets/products/web-portal.png'} />
                          </div>
                        )}

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

                        {app.isExternal ? (
                          <Link href={app.download_url} target="_blank" rel="noopener noreferrer" className="w-fit">
                            <Button className="w-fit flex gap-2">
                              {t('main.products.open_web_portal')}
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        ) : (
                          <Link href={formatURL(app.download_url, lang)} className="w-fit">
                            <Button className="w-fit flex gap-2">
                              {t('main.products.download_now')}
                              <DownloadIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        
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

export default Products