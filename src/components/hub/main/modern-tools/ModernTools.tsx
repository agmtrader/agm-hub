'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { formatURL } from '@/utils/language/lang'
import useEmblaCarousel from 'embla-carousel-react'
import { modernTools } from '@/lib/public/modern-tools'
import { Badge } from '@/components/ui/badge'

const ModernTools = () => {
  const { t, lang } = useTranslationProvider()
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
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
    <div className="container flex flex-col items-center justify-center gap-8 overflow-hidden px-4 py-6 md:gap-10 md:py-10">
      
      <div 
        className="text-center space-y-4"
      >
        <h2 className="text-4xl font-bold tracking-tighter md:text-5xl">{t('main.modern_tools.title')}</h2>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-xl">
          {t('main.modern_tools.description')}
        </p>
      </div>

      <div className="flex w-full max-w-3xl items-center justify-center gap-2 md:gap-4">
        <Button
          variant="outline"
          size="icon"
          className="hidden shrink-0 rounded-full shadow-md sm:inline-flex"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="w-full overflow-hidden px-0 sm:px-4">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 py-4 md:gap-6">
              {tools.map((tool, index) => (
                <div key={index} className="min-w-0 flex-[0_0_100%] pl-2 first:pl-0 sm:pl-4">
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <div className="p-4 pb-0 md:p-6 md:pb-0">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                             {tool.image ? (
                                <Image 
                                    src={tool.image} 
                                    alt={tool.title} 
                                    fill
                                    className="object-cover"
                                />
                             ) : (
                                <tool.icon className="h-12 w-12 text-muted-foreground/50" />
                             )}
                        </div>
                    </div>
                    
                    <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
                      <CardTitle className="text-xl font-bold text-foreground text-center">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-grow flex-col items-center justify-between gap-6 pt-0 pb-6 text-center">
                      <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
                      
                      <div className="mt-auto pt-2">
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

        </div>

        <Button
          variant="outline"
          size="icon"
          className="hidden shrink-0 rounded-full shadow-md sm:inline-flex"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    
    </div>
  )
}

export default ModernTools
