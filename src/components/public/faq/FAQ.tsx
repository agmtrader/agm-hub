'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { containerVariants, itemVariants } from '@/lib/anims'

type Props = {}

function FAQ({}: Props) {

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { t } = useTranslationProvider()

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className='w-full h-fit flex flex-col justify-center text-agm-dark-blue p-5 gap-5 items-center'
    >
      <motion.p variants={itemVariants} className='text-5xl text-center font-bold'>{t('shared.faq.title')}</motion.p>
      <Accordion type="single" collapsible className="w-[80%] text-start">
        <motion.div variants={itemVariants}>
          <AccordionItem value="item-1" >
            <AccordionTrigger>
              <p className='text-sm font-bold'>{t('shared.faq.question_1')}</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className='text-sm font-light'>
              {t('shared.faq.answer_1')}
              <a className='font-bold' href='https://agmtechnology.com/apply' rel="noopener noreferrer" target="_blank"> {t('shared.faq.answer_1_link')}</a>
              </p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
        <motion.div variants={itemVariants}>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <p className='text-sm font-bold'>{t('shared.faq.question_2')}</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className='text-sm font-light'>
              {t('shared.faq.answer_2')}
              </p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
        <motion.div variants={itemVariants}>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <p className='text-sm font-bold'>{t('shared.faq.question_3')}</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className='text-sm font-light'>
                {t('shared.faq.answer_3')}
              </p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
        <motion.div variants={itemVariants}>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              <p className='text-sm font-bold'>{t('shared.faq.question_4')}</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className='text-sm font-light'>
              {t('shared.faq.answer_4')}
              </p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
        <motion.div variants={itemVariants}>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              <p className='text-sm font-bold'>{t('shared.faq.question_5')}</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className='text-sm font-light'>
              {t('shared.faq.answer_5')}
              </p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
        <motion.div variants={itemVariants}>
          <AccordionItem value="item-6">
            <AccordionTrigger>
              <p className='text-sm font-bold'>{t('shared.faq.question_6')}</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className='text-sm font-light'>
              {t('shared.faq.answer_6')}
              </p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      </Accordion>
    </motion.div>
  )
}

export default FAQ