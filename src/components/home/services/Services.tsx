'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { formatURL } from '@/utils/lang'

interface Service {
  name: string;
  icon: React.ReactNode;
  description: string;
  url: string;
}

interface ServicesProps {
  services: Service[];
}

const Services = ({ services }: ServicesProps) => {

  const { lang } = useTranslationProvider()

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

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
        <div className='flex flex-col gap-y-5 items-center'> 
        <motion.p 
          variants={itemVariants}
          className='font-bold text-5xl text-background'
        >
          Our Services
        </motion.p>
        <motion.p 
          variants={itemVariants}
          className='text-center text-lg text-background'
        >
          Explore our services and find the one that best suits your needs.
        </motion.p>
        </div>

        <div className={`grid ${getGridColumns(services.length)} gap-8 w-full max-w-6xl px-4`}>
          {services.map((service, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="flex flex-col w-full justify-center items-center gap-5"
            >
              <Card className='bg-secondary-dark p-2 border-0 text-background transition-transform duration-300 hover:scale-110'>
                
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className='w-full h-full flex justify-center text-background items-center cursor-pointer'>
                        {service.icon}
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-background text-foreground flex flex-col gap-y-5 justify-center items-center">
                      <DialogHeader>
                        <DialogTitle>{service.name}</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        {service.description}
                      </DialogDescription>
                      <DialogFooter>
                        <Button asChild>
                          <Link href={formatURL(service.url, lang)}>
                            Learn More
                          </Link>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
              <p className='text-background w-fit text-center text-lg font-semibold'>{service.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Services
