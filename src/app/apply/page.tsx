'use client'

import React, { useState } from 'react';
import GeneralInfo from '@/components/apply/GeneralInfo'
import AboutYouPrimary from '@/components/apply/AboutYouPrimary';
import { Ticket } from '@/lib/types';
import Regulatory from '@/components/apply/Regulatory';



type Props = {}

const page = (props: Props) => {

  const [step, setStep] = useState<number>(3)

  const [cache, setCache] = useState(null)

  const [ticket, setTicket] = useState<Ticket | null>(null)
  console.log(ticket)

  function stepForward() {
      setStep(step + 1)
  }

  function stepBackwards() {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className='w-full h-full flex mt-[20vh] flex-col gap-y-10 justify-center items-center'>
      <div className='w-full h-fit flex justify-center items-center'>
        <p className='text-7xl font-bold'>{step}.</p>
      </div>

      {step === 1 && <GeneralInfo stepForward={stepForward} setTicket={setTicket}/>}
      {(step === 2) && <AboutYouPrimary stepForward={stepForward} stepBackwards={stepBackwards}/>}
      {(step === 3) && <Regulatory stepForward={stepForward} stepBackwards={stepBackwards}/>}

    </div>
)}

export default page