'use client'

import React, { useState } from 'react';
import GeneralInfo from '@/components/apply/GeneralInfo'
import AboutYouPrimary from '@/components/apply/AboutYouPrimary';
import { Ticket } from '@/lib/types';
import Regulatory from '@/components/apply/Regulatory';
import AboutYouSecondary from '@/components/apply/AboutYouSecondary';


const ClientForm = () => {

  const [step, setStep] = useState<number>(1)

  const [ticket, setTicket] = useState<Ticket | null>(null)
  console.log(ticket)

  function stepForward() {
      setStep(step + 1)
  }

  function stepBackward() {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Add splash screen to choose tickets associated with accounts
  // Ticket -> clientId

  return (
    <div className='w-full h-full flex flex-col mt-32 justify-center items-center'>

      {step === 1 && <GeneralInfo step={step} stepForward={stepForward} setTicket={setTicket}/>}
      
        {(ticket && ticket['ApplicationInfo']['account_type'] === 'individual') && (
            (step === 2) ? <AboutYouPrimary ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackward={stepBackward}/>
            :
            (step === 3) && <Regulatory ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackwards={stepBackward}/>
            )
        }

    </div>
)}

export default ClientForm