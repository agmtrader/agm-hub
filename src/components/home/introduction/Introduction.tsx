'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// ... (keep the existing imports)

interface IntroductionProps {
  title: string;
  description: string[];
  cards: {
    title: string;
    description: string;
    items: { icon: React.ReactNode; label: string }[];
  }[];
  ctaText: string;
  ctaSubtext: string;
}

const Introduction: React.FC<IntroductionProps> = ({ title, description, cards, ctaText, ctaSubtext }) => {
  const { t } = useTranslationProvider()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-100px 0px',
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const listItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
  }

  const getGridColumns = (length: number) => {
    if (length === 1) return 'grid-cols-1';
    if (length === 2) return 'grid-cols-1 md:grid-cols-2';
    if (length === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    if (length === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <motion.div 
      ref={ref}
      className="flex flex-col h-fit w-full justify-center items-center py-10"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="flex flex-col h-full text-foreground w-full max-w-6xl text-center gap-y-10 justify-center items-center">
        <motion.h1 variants={itemVariants} className='text-5xl font-bold'>{title}</motion.h1>
        {description.map((paragraph, index) => (
          <motion.p key={index} variants={itemVariants} className='text-xl font-light'>
            {paragraph}
          </motion.p>
        ))}
        <div className={`grid ${getGridColumns(cards.length)} gap-6 w-full`}>
          {cards.map((card, cardIndex) => (
            <motion.div key={cardIndex} variants={itemVariants} className="w-full">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <h2 className='text-xl font-semibold'>{card.title}</h2>
                </CardHeader>
                <CardContent className='flex-grow flex flex-col justify-center items-center'>
                  <motion.div 
                    className='grid grid-cols-1 gap-4 w-full'
                    variants={containerVariants}
                  >
                    <motion.p variants={itemVariants} className='text-sm text-center'>
                      {card.description}
                    </motion.p>
                    <motion.div 
                      className='flex flex-row gap-4 justify-center'
                      variants={containerVariants}
                    >
                      {card.items.map((item, index) => (
                        <motion.div 
                          key={index} 
                          variants={listItemVariants}
                        >
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="bg-agm-blue text-primary p-2 rounded-full flex items-center justify-center">
                                  {item.icon}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className='bg-background'>
                                <p>{item.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <motion.div variants={itemVariants} className='w-full flex justify-center items-center'>
          <Button size="lg" className="mt-6 flex flex-col p-5 py-10">
            <span className='text-lg font-semibold'>{ctaText}</span>
            <span className='text-sm'>{ctaSubtext}</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Introduction
