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

type Props = {}

function FAQ({}: Props) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
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
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className='w-full h-fit flex flex-col justify-center text-agm-dark-blue gap-y-16 items-center'
    >
      <motion.p variants={itemVariants} className='text-5xl text-center font-bold'>Frequently Asked Questions</motion.p>
      <Accordion type="single" collapsible className="w-[80%] text-start">
        <motion.div variants={itemVariants}>
          <AccordionItem value="item-1" >
            <AccordionTrigger>
              <p className='text-sm font-bold'>How to create a savings/investment account?</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className='text-sm font-light'>
              Please <a className='font-bold' href='https://agmtechnology.com/apply' rel="noopener noreferrer" target="_blank">click here</a> to apply online.
              </p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
        <motion.div variants={itemVariants}>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <p className='text-sm font-bold'>What security measures do you offer?</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className='text-sm font-light'>
              Accounts are insured under the SIPC (Securities Investor Protection Corporation) 
              and by Lloyd's in London. The accounts are under regulation of the SEC (Securities and Exchange Commission) 
              and FINRA (Financial Industry Regulatory Authority) in the United States.
              </p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
        <motion.div variants={itemVariants}>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <p className='text-sm font-bold'>What types of accounts are available at AGM?</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className='text-sm font-light'>
                Individual, joint, and corporate accounts. We serve both 
                institutional and individual clients internationally.
              </p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
        <motion.div variants={itemVariants}>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              <p className='text-sm font-bold'>Where does my money go?</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className='text-sm font-light'>
              After opening your account and making an initial savings/investment deposit, 
              the money goes directly to the custodian in the USA that holds your AGM account in your name, 
              you will have access to see and monitor your account 24/7.
              </p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
        <motion.div variants={itemVariants}>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              <p className='text-sm font-bold'>Are there any taxes to consider?</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className='text-sm font-light'>
                There are no interest or capital gains taxes on the account. 
                Taxes are only charged on dividends received.
              </p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
        <motion.div variants={itemVariants}>
          <AccordionItem value="item-6">
            <AccordionTrigger>
              <p className='text-sm font-bold'>Who can move the money in each account?</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className='text-sm font-light'>
              Only the account owner, the first designated person, can move the money 
              in and out of the account to a bank account in the same name of the account owner. 
              The custodian does not allow third party wires for the protection of the client.
              </p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      </Accordion>
    </motion.div>
  )
}

export default FAQ