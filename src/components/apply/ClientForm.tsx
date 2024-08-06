'use client'

import React, { useState } from 'react';
import GeneralInfo from './account/components/GeneralInfo';
import AboutYouPrimary from './account/components/AboutYou';
import Regulatory from './account/components/Regulatory';
import { Ticket } from '@/lib/types';
import AboutYou from './account/components/AboutYou';

const ClientForm = () => {

  const [step, setStep] = useState<number>(1)

  const [ticket, setTicket] = useState<Ticket | null>(null)

  function stepForward() {
      setStep(step + 1)
  }

  function stepBackward() {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className='w-full h-full flex flex-col mt-10 mb-10 justify-center items-start'>

      {step === 1 && <GeneralInfo step={step} stepForward={stepForward} setTicket={setTicket}/>}
      
        {(ticket && ticket['ApplicationInfo']['account_type'] === 'individual') ? (
            (step === 2) ? <AboutYou primary ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackward={stepBackward}/>
            :
              (step === 3) ? <Regulatory ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackwards={stepBackward}/>
              : 
                (step == 4) && 'Done!'
            )
          :
          (ticket && ticket['ApplicationInfo']['account_type'] === 'joint') && (

            (step === 2) ? <AboutYou primary ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackward={stepBackward}/>
            :
              (step === 3) ? <AboutYou primary={false} ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackward={stepBackward}/>
              : 
                (step == 4) ? <Regulatory ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackwards={stepBackward}/>
                :
                (step == 5) && 'Done!'
            )
        }

    </div>
)}

export default ClientForm