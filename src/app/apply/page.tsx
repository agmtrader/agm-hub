'use client'

import React, { useState } from 'react';
import GeneralInfo from '@/components/apply/GeneralInfo'
import AboutYouPrimary from '@/components/apply/AboutYouPrimary';



type Props = {}

const page = (props: Props) => {

  const [step, setStep] = useState<number>(2)
  const [canContinue, setCanContinue] = useState<boolean>(false)

  const [cache, setCache] = useState(null)
  const [error, setError] = useState<string | null>(null)

  function stepForward() {
    if (canContinue) {
      setStep(step + 1)
      setError(null)
      setCanContinue(false)
    } else {
      switch (step) {
        case 1:
          setError('You must fill all fields to continue.');
          break;
        case 2:
          setError('Ticket has no documents.');
          break;
        case 3:
          setError('Must submit temporary email data to continue.');
          break;
        default:
          setError(null)
          break;
    }
    }
  }

  function stepBackwards() {
    if (step > 1) {
      setStep(step - 1)
      setError(null)
    }
  }

  const applicationId = 1002

  return (
    <div className='w-full h-full flex mt-[20vh] flex-col gap-y-10 justify-center items-center'>
      <div className='w-full h-fit flex justify-center items-center'>
        <p className='text-7xl font-bold'>{step}.</p>
      </div>
      {step == 1 && <GeneralInfo stepForward={stepForward} setCanContinue={setCanContinue}/>}
      {(step == 2) && <AboutYouPrimary stepForward={stepForward} setCanContinue={setCanContinue} stepBackwards={stepBackwards}/>}
      <div className='h-full w-full flex flex-col items-center gap-y-10 justify-start'>
        {error && <p className='text-lg'>{error}</p>}
      </div>
    </div>
)}

export default page