'use client'
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import TicketManager from '@/components/dashboard/open_account/TicketManager';
import BackupDocuments from '@/components/dashboard/open_account/BackupDocuments';
import FillApplicationForm from '@/components/dashboard/open_account/FillApplicationForm';
import OpenAccount from '@/components/dashboard/open_account/OpenAccount';
import { Ticket } from '@/lib/types';
import { accessAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

const page = () => {

  const [step, setStep] = useState<number>(1)
  const [canContinue, setCanContinue] = useState<boolean>(false)
  
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)
  const [account, setAccount] = useState<any>(null)

  const { toast } = useToast()

  async function stepForward() {
    if (canContinue) {
      setCanContinue(false)
      setStep(step + 1)
      if (step === 4 && currentTicket) {
        await accessAPI('/database/update', 'POST', {'path': `db/clients/tickets/${currentTicket['TicketID']}`, 'key': 'Status', 'value': 'Closed'})
      }
    } else {
      let errorMessage = '';
      switch (step) {
        case 1:
          errorMessage = 'You must select one ticket to continue';
          break;
        case 2:
          errorMessage = 'Must submit form information to continue.';
          break;
        case 3:
          errorMessage = 'Ticket has no documents';
          break;
      }
      if (errorMessage) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  }

  function stepBackwards() {
    if (step > 1) {
      setStep(step - 1)
    }
  }
  
  return (
    
    <div className='w-full h-fit gap-y-10 py-5 text-foreground flex flex-col justify-center items-center'>

      {step == 1 && <TicketManager setCurrentTicket={setCurrentTicket} currentTicket={currentTicket} setCanContinue={setCanContinue}/>}

      {(step == 2 && currentTicket) && <OpenAccount currentTicket={currentTicket} setCanContinue={setCanContinue} setAccount={setAccount} account={account}/>}

      {(step == 3 && currentTicket) && <BackupDocuments currentTicket={currentTicket} setCanContinue={setCanContinue} canContinue={canContinue} account={account}/>}

      {(step == 4 && currentTicket) && <FillApplicationForm currentTicket={currentTicket} setCanContinue={setCanContinue}/>}

      {(step == 5 && currentTicket) && <p className='text-7xl font-bold'>Finished opening account.</p>}

      {step < 5 && 
        <div className='h-fit w-fit flex gap-x-5'>
          {step > 1 && <Button onClick={stepBackwards} >Previous step.</Button>}
          <Button onClick={(e) => stepForward()} variant={canContinue ? 'primary':'ghost'}>{step === 4 ? 'Finish.':'Next step.'}</Button>
        </div>
      }
    </div>
  )
}

export default page