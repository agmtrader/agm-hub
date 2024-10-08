'use client'

import React, { useState } from 'react';
import GeneralInfo from './components/GeneralInfo';
import Regulatory from './components/Regulatory';
import { Ticket } from '@/lib/types';
import AboutYou from './components/AboutYou';
import { FormHeader } from '../../Header';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
    <div className='w-full h-fit flex flex-col justify-center items-center'>

      <FormHeader />

      <div className='w-fit h-fit flex flex-col justify-center items-center pb-10'>

        {step === 1 && <GeneralInfo step={step} ticket={ticket} stepForward={stepForward} setTicket={setTicket}/>}
        
          {(ticket && ticket['ApplicationInfo']['account_type'] === 'Individual') ? (
              (step === 2) ? <AboutYou primary ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackward={stepBackward}/>
              :
                (step === 3) ? <Regulatory ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackwards={stepBackward}/>
                : 
                  (step == 4) && 
                  <div className='h-full w-full flex flex-col justify-center items-center gap-y-8 py-16'>
                    <Check className='w-24 h-24 text-green-500' />
                    <p className='text-2xl font-semibold text-gray-700'>Your application has been successfully submitted.</p>
                    <div className='flex flex-col items-center gap-y-4'>
                      <p className='text-lg text-gray-600'>Thank you for choosing our services. Well review your application and get back to you soon.</p>
                    </div>
                    <Button variant='ghost'>
                      <Link href='/'>Go back home</Link>
                    </Button>
                  </div>
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