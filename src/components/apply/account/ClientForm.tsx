'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GeneralInfo from './components/GeneralInfo';
import Regulatory from './components/Regulatory';
import { Ticket } from '@/lib/types';
import AboutYou from './components/AboutYou';
import { FormHeader } from '@/components/Header';
import ApplicationEnd from './components/ApplicationEnd';
import DevelopmentPage from '@/components/misc/DevelopmentPage';
import AuthorizedPerson from './components/AuthorizedPerson';
import AboutOrganization from './components/AboutOrganization';

interface Props {
  ticketProp: Ticket | null
}

const ClientForm = ({ticketProp}: Props) => {

  const [step, setStep] = useState<number>(1)
  const [ticket, setTicket] = useState<Ticket | null>(ticketProp || null)

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

  const handleRefresh = () => {
    const confirmRefresh = window.confirm("Are you sure you want to refresh? This will delete your current progress.");
    if (confirmRefresh) {
      // Logic to reset the form or progress
      setStep(1);
      setTicket(null);
    }
  };

  const renderFormStep = () => {

    if (!ticket) {
        if (step === 1) {
          return (
            <GeneralInfo 
            ticket={ticket}
            stepForward={stepForward} 
            setTicket={setTicket}
          />
        )
      }
      else {
        return null
      }
    }

    if (ticket) {

      if (ticket.ApplicationInfo.account_type === 'Individual') {
        if (step === 1) {
          return (
            <GeneralInfo 
              ticket={ticket}
              stepForward={stepForward} 
              setTicket={setTicket}
            />
          )
        }
        if (step === 2) {
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
          )
        }
        if (step === 2) {
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

      if (ticket.ApplicationInfo.account_type === 'Institutional') {

        if (step === 1) {
          return (
            <GeneralInfo 
              ticket={ticket}
              stepForward={stepForward} 
              setTicket={setTicket}
            />
          )
        }
        
        if (step === 2) {
          return (
            <AboutOrganization
              stepBackward={stepBackward}
              ticket={ticket}
              setTicket={setTicket}
              stepForward={stepForward}
            />
          )
        }
        if (step === 3) {
          return (
            <AuthorizedPerson
              stepBackward={stepBackward}
              ticket={ticket}
              setTicket={setTicket}
              stepForward={stepForward}
            />
          )
        }
        if (step === 4) {
          return (
            <Regulatory
              ticket={ticket}
              setTicket={setTicket}
              stepForward={stepForward}
              stepBackwards={stepBackward}
            />
          )
        }
        if (step === 5) {
          return <ApplicationEnd />
        }
      }

      if (ticket.ApplicationInfo.account_type === 'Trust') {
        if (step === 2) {
          return <DevelopmentPage />
        }
      }
    }
    
  }

  console.log(ticket)

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to refresh? This will delete your current progress.";
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [])

  return (
    <div className='w-full flex flex-col h-full'>
      <FormHeader/>
      <div className='w-full h-fit flex flex-col my-16 justify-center items-center'>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className='w-full max-w-xl p-5 h-fit flex flex-col justify-center items-center pb-10'
          >
            {renderFormStep()}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
)}

export default ClientForm