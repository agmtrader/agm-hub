'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { formatURL } from '@/utils/language/lang'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from "framer-motion"
import { modernTools } from '@/lib/public/modern-tools'
import { Badge } from '@/components/ui/badge'

const ModernTools = () => {
  const { t, lang } = useTranslationProvider()
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  })

  const tools = modernTools(t)

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
    <div className="container flex flex-col gap-10 justify-center items-center py-10 overflow-hidden">
      
      <motion.div 
        className="text-center space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.h2 className="text-5xl font-bold tracking-tighter" variants={itemVariants}>{t('main.modern_tools.title')}</motion.h2>
        <motion.p className="text-xl text-muted-foreground max-w-2xl mx-auto" variants={itemVariants}>
          {t('main.modern_tools.description')}
        </motion.p>
      </motion.div>

      <div className="flex items-center justify-center gap-4 max-w-3xl">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <motion.div 
          className="w-full flex items-center justify-center gap-4 px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 py-4">
              {tools.map((tool, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 pl-4 first:pl-0">
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-col items-center justify-center space-y-4 pb-2">
                      <div className="p-4 bg-primary/10 rounded-full">
                          <tool.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-foreground text-center">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-between text-center gap-6 flex-grow pt-0">
                      <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
                      
                      <div className="mt-auto pt-4">
                          {tool.isWip ? (
                              <Badge variant="secondary" className="px-4 py-1 text-sm font-medium">
                                  {tool.badgeText || "Coming Soon"}
                              </Badge>
                          ) : (
                              <Link href={formatURL(tool.link || '#', lang)}>
                                  <Button className="gap-2 w-full sm:w-auto">
                                      {tool.buttonText} 
                                      <ArrowRight className="h-4 w-4" />
                                  </Button>
                              </Link>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

        </motion.div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    
    </div>
  )
}

export default ModernTools
