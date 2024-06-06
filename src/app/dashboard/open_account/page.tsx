'use client'
import React, { useState } from 'react';

import { DocumentData } from 'firebase/firestore/lite';

import { Button } from '@/components/ui/button';

import TicketManager from '@/components/dashboard/open_account/TicketManager';
import BackupDocuments from '@/components/dashboard/open_account/BackupDocuments';
import OpenAccount from '@/components/dashboard/open_account/OpenAccount';
import CreateEmail from '@/components/dashboard/open_account/CreateEmail';

const page = () => {

  const [step, setStep] = useState<number>(1)
  const [canContinue, setCanContinue] = useState<boolean>(false)

  const [currentTicket, setCurrentTicket] = useState<DocumentData | null>(null)
  const [error, setError] = useState<string | null>(null)

  function stepForward(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (canContinue) {
      setStep(step + 1)
      setError(null)
      setCanContinue(false)
    } else {
      switch (step) {
        case 1:
          setError('You must select one ticket to continue');
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

  return (
    <div className='w-full h-full flex mt-[20vh] flex-col gap-y-10 justify-center items-center'>
      <div className='w-full h-fit flex justify-center items-center'>
        <p className='text-7xl font-bold'>{step}.</p>
      </div>
      {step == 1 && <TicketManager setCurrentTicket={setCurrentTicket} currentTicket={currentTicket} setCanContinue={setCanContinue}/>}
      {(step == 2 && currentTicket) && <BackupDocuments currentTicket={currentTicket} setCanContinue={setCanContinue} canContinue={canContinue}/>}
      {(step == 3 && currentTicket) && <CreateEmail currentTicket={currentTicket} setCanContinue={setCanContinue}/>}
      {(step == 4 && currentTicket) && <OpenAccount currentTicket={currentTicket} setCanContinue={setCanContinue} />}
      <div className='h-full w-full flex flex-col items-center gap-y-10 justify-start'>
        <div className='h-fit w-fit flex items-center gap-x-10 justify-start'>
          {step > 1 && <Button variant={'default'} onClick={stepBackwards} >Previous step.</Button>}
          <Button variant={canContinue ? 'default':'destructive'} className='' onClick={(e) => stepForward(e)}>{step === 4 ? 'Finish.':'Next step.'}</Button>
        </div>
        {error && <p className='text-lg'>{error}</p>}
      </div>
    </div>
  )
}

export default page