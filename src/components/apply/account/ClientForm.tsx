'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Confetti } from '@/components/ui/confetti';
import GeneralInfo from './components/GeneralInfo';
import Regulatory from './components/Regulatory';
import { Ticket } from '@/lib/types';
import AboutYou from './components/AboutYou';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FormHeader, Header } from '@/components/Header';

const ClientForm = () => {

  const [step, setStep] = useState<number>(1)
  const [ticket, setTicket] = useState<Ticket | null>(null)

  function stepForward() {
      setStep(step + 1)
      scrollToTop()
  }

  function stepBackward() {
    if (step >= 1) {
      setStep(step - 1)
    }
  }

  const isBrowser = () => typeof window !== 'undefined';
  function scrollToTop() {
      if (!isBrowser()) return;
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const pageVariants = {
    initial: { opacity: 0, x: '-100%' },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: '100%' },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <div className='w-full h-fit flex flex-col justify-center items-center'>

      <FormHeader/>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className='w-fit h-fit flex flex-col justify-center items-center pb-10'
        >
          {step === 1 && <GeneralInfo step={step} ticket={ticket} stepForward={stepForward} setTicket={setTicket}/>}
          
          {(ticket && ticket['ApplicationInfo']['account_type'] === 'Individual') ? (
              (step === 2) ? <AboutYou primary ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackward={stepBackward}/>
              :
                (step === 3) ? <Regulatory ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackwards={stepBackward}/>
                : 
                  (step == 4) && 
                  <Final/>
              )
            :
            (ticket && ticket['ApplicationInfo']['account_type'] === 'Joint') && (

              (step === 2) ? <AboutYou primary ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackward={stepBackward}/>
              :
                (step === 3) ? <AboutYou primary={false} ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackward={stepBackward}/>
                : 
                  (step == 4) ? <Regulatory ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackwards={stepBackward}/>
                  :
                  (step == 5) && 
                  <Final/>
              )
          }
        </motion.div>
      </AnimatePresence>

    </div>
)}

export default ClientForm

const Final = () => {
  return (
    <div className='relative h-full w-full flex flex-col justify-center items-center gap-y-8 py-16'>
      <Confetti
        className="absolute left-0 top-0 -z-10 size-full pointer-events-none"
      />
      <Check className='w-24 h-24 text-green-500' />
      <p className='text-2xl font-semibold text-gray-700'>Your application has been successfully submitted.</p>
      <div className='flex flex-col items-center gap-y-4'>
        <p className='text-lg text-gray-600'>Thank you for choosing our services. We'll review your application and get back to you soon.</p>
      </div>
      <Button>
        <Link href='/apply'>Apply for another account</Link>
      </Button>
      <Button variant='ghost'>
        <Link href='/'>Go back home</Link>
      </Button>
    </div>
  )
}