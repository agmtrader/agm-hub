'use client'

import React, { useState } from 'react';
import GeneralInfo from './components/GeneralInfo';
import AboutYouPrimary from './components/AboutYou';
import Regulatory from './components/Regulatory';
import { Ticket } from '@/lib/types';
import AboutYou from './components/AboutYou';
import { FormHeader } from '../../Header';
import { ScrollArea } from '../../ui/scroll-area';

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

  return (
    <div className='w-full h-full flex flex-col'>

      <FormHeader />

      <div className='w-full h-fit pb-10'>

        {step === 1 && <GeneralInfo step={step} stepForward={stepForward} setTicket={setTicket}/>}
        
          {(ticket && ticket['ApplicationInfo']['account_type'] === 'Individual') ? (
              (step === 2) ? <AboutYou primary ticket={ticket} stepForward={stepForward} stepBackward={stepBackward}/>
              :
                (step === 3) ? <Regulatory ticket={ticket} stepForward={stepForward} stepBackwards={stepBackward}/>
                : 
                  (step == 4) && 
                  <div className='h-full w-full flex flex-col justify-center items-center'>
                    <h1 className='text-7xl font-bold'>Done!</h1>
                    <p className='text-xl font-bold'>Your application has been submitted</p>
                  </div>
              )
            :
            (ticket && ticket['ApplicationInfo']['account_type'] === 'Joint') && (

              (step === 2) ? <AboutYou primary ticket={ticket} stepForward={stepForward} stepBackward={stepBackward}/>
              :
                (step === 3) ? <AboutYou primary={false} ticket={ticket} stepForward={stepForward} stepBackward={stepBackward}/>
                : 
                  (step == 4) ? <Regulatory ticket={ticket} stepForward={stepForward} stepBackwards={stepBackward}/>
                  :
                  (step == 5) && 
                    <div className='h-full w-full flex flex-col justify-center items-center'>
                      <h1 className='text-7xl font-bold'>Done!</h1>
                      <p className='text-xl font-bold'>Your application has been submitted</p>
                    </div>
              )
          }
      </div>

    </div>
)}

export default ClientForm