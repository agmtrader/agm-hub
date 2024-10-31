'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GeneralInfo from './components/GeneralInfo';
import Regulatory from './components/Regulatory';
import { Ticket } from '@/lib/types';
import AboutYou from './components/AboutYou';
import { FormHeader } from '@/components/Header';
import ApplicationEnd from './components/ApplicationEnd';

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
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  }

  const renderFormStep = () => {
    if (!ticket) {
      return step === 1 && (
        <GeneralInfo 
          ticket={ticket}
          stepForward={stepForward} 
          setTicket={setTicket}
        />
      );
    }

    if (ticket.ApplicationInfo.account_type === 'Individual') {
      if (step === 1) {
        return (
          <GeneralInfo 
            ticket={ticket} 
            stepForward={stepForward} 
            setTicket={setTicket}
          />
        );
      } else if (step === 2) {
        return (
          <AboutYou 
            primary 
            ticket={ticket} 
            setTicket={setTicket} 
            stepForward={stepForward} 
            stepBackward={stepBackward}
          />
        );
      } else if (step === 3) {
        return (
          <Regulatory 
            ticket={ticket} 
            setTicket={setTicket} 
            stepForward={stepForward} 
            stepBackwards={stepBackward}
          />
        );
      } else if (step === 4) {
        return <ApplicationEnd />;
      }
    }

    if (ticket.ApplicationInfo.account_type === 'Joint') {
      if (step === 1) {
        return (
          <GeneralInfo 
            ticket={ticket} 
            stepForward={stepForward} 
            setTicket={setTicket}
          />
        );
      } else if (step === 2) {
        return (
          <AboutYou 
            primary 
            ticket={ticket} 
            setTicket={setTicket} 
            stepForward={stepForward} 
            stepBackward={stepBackward}
          />
        );
      } else if (step === 3) {
        return (
          <AboutYou 
            primary={false} 
            ticket={ticket} 
            setTicket={setTicket} 
            stepForward={stepForward} 
            stepBackward={stepBackward}
          />
        );
      } else if (step === 4) {
        return (
          <Regulatory 
            ticket={ticket} 
            setTicket={setTicket} 
            stepForward={stepForward} 
            stepBackwards={stepBackward}
          />
        );
      } else if (step === 5) {
        return <ApplicationEnd />;
      }
    }

    return null;
    
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
          {renderFormStep()}
        </motion.div>
      </AnimatePresence>

    </div>
)}

export default ClientForm