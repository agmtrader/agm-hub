'use client'
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import TicketManager from '@/components/dashboard/open_account/TicketManager';
import BackupDocuments from '@/components/dashboard/open_account/BackupDocuments';
import FillApplicationForm from '@/components/dashboard/open_account/FillApplicationForm';
import OpenAccount from '@/components/dashboard/open_account/OpenAccount';
import { Ticket } from '@/lib/types';

const page = () => {

  // Variables to control step in the process
  const [step, setStep] = useState<number>(1)
  const [canContinue, setCanContinue] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  // Current ticket
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)

  // Current account
  const [account, setAccount] = useState<any>(null)

  function stepForward() {
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
          setError('Must submit form information to continue.');
          break;
        case 3:
          setError('Ticket has no documents');
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

      {(step == 2 && currentTicket) && <OpenAccount currentTicket={currentTicket} setCanContinue={setCanContinue} setAccount={setAccount} account={account}/>}

      {(step == 3 && currentTicket) && <BackupDocuments currentTicket={currentTicket} setCanContinue={setCanContinue} canContinue={canContinue} account={account}/>}

      {(step == 4 && currentTicket) && <FillApplicationForm currentTicket={currentTicket} setCanContinue={setCanContinue}/>}

      {(step == 5 && currentTicket) && <p className='text-7xl font-bold'>Finished opening account.</p>}

      {step < 5 && 
        <div className='h-full w-full flex flex-col items-center gap-y-10 justify-start'>

          <div className='h-fit w-fit flex items-center gap-x-10 justify-start'>
            {step > 1 && <Button variant={'default'} onClick={stepBackwards} >Previous step.</Button>}
            <Button variant={canContinue ? 'default':'destructive'} className='' onClick={(e) => stepForward()}>{step === 4 ? 'Finish.':'Next step.'}</Button>
          </div>
  
          {error && <p className='text-lg'>{error}</p>}
  
        </div>
      }
    </div>
  )
}

export default page