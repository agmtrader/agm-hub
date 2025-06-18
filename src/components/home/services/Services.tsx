'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { formatURL } from '@/utils/language/lang'
import { containerVariants, itemVariants } from '@/lib/anims'

interface Service {
  name: string;
  image: string;
  description: string;
  url: string;
}

interface ServicesProps {
  services: Service[];
}

const Services = ({ services }: ServicesProps) => {

  const { t, lang } = useTranslationProvider()

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const getGridColumns = (length: number) => {
    if (length === 1) return 'grid-cols-1';
    if (length === 2) return 'grid-cols-1 md:grid-cols-2';
    if (length === 3) return 'grid-cols-1 md:grid-cols-3';
    if (length === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className='flex flex-col h-fit w-full'
    >
      <div className='bg-secondary w-full h-full justify-center items-center flex flex-col gap-y-20 py-20'>
        <div className='flex flex-col gap-y-5 items-center justify-center'> 
        <motion.p 
          variants={itemVariants}
          className='font-bold text-5xl text-background text-center'
        >
          {t('shared.services.title')}
        </motion.p>
        <motion.p 
          variants={itemVariants}
          className='text-center text-lg text-background'
        >
          {t('shared.services.description')}
        </motion.p>
        </div>

        <div className={`grid ${getGridColumns(services.length)} gap-8 w-full max-w-6xl px-4`}>
          {services.map((service, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="flex flex-col w-full justify-center items-center gap-5"
            >
              <Card className='group relative bg-secondary-dark overflow-hidden border-0 transition-transform duration-300 hover:scale-110'>
                <div className='absolute inset-0 bg-black/60 transition-opacity duration-300 group-hover:opacity-30'/>
                <img 
                  src={service.image} 
                  alt={service.name}
                  className='w-full h-full object-cover aspect-square'
                />
                <CardContent className="absolute inset-0 flex items-center justify-center p-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className='w-full h-full flex justify-center text-background items-center cursor-pointer'>
                        <span className='text-3xl font-bold'>{service.name}</span>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-background text-foreground flex flex-col gap-y-5 text-center justify-center items-center">
                      <DialogHeader>
                        <DialogTitle>{service.name}</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        {service.description}
                      </DialogDescription>
                      <DialogFooter>
                        <Button asChild>
                          <Link href={formatURL(service.url, lang)}>
                            {t('shared.services.learn_more')}
                          </Link>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Services
