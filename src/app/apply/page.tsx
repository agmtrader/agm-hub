'use client'

import React, { useState } from 'react';
import GeneralInfo from '@/components/apply/GeneralInfo'
import AboutYouPrimary from '@/components/apply/AboutYouPrimary';
import { Ticket } from '@/lib/types';
import Regulatory from '@/components/apply/Regulatory';
import AboutYouSecondary from '@/components/apply/AboutYouSecondary';



type Props = {}

const page = (props: Props) => {

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

  return (
    <div className='w-full h-full flex my-32 flex-col gap-y-10 justify-center items-center'>
      <div className='w-full h-fit flex justify-center items-center'>
        <p className='text-7xl font-bold'>{step}.</p>
      </div>

      {step === 1 && <GeneralInfo stepForward={stepForward} setTicket={setTicket}/>}
      
      {(ticket && ticket['ApplicationInfo']['account_type'] === 'individual') && (
        (step === 2) ? <AboutYouPrimary ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackward={stepBackward}/>
        :
        (step === 3) && <Regulatory ticket={ticket} setTicket={setTicket} stepForward={stepForward} stepBackwards={stepBackward}/>
        )
      }

    </div>
)}

export default page