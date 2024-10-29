'use client'
import React, { useState } from 'react';

import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';

import TicketManager from '@/components/dashboard/open_account/TicketManager';
import BackupDocuments from '@/components/dashboard/open_account/BackupDocuments';
import FillApplicationForm from '@/components/dashboard/open_account/FillApplicationForm';
import OpenAccount from '@/components/dashboard/open_account/OpenAccount';
import { Account, Ticket } from '@/lib/types';
import { accessAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import Confetti from '@/components/ui/confetti';
import { Check } from 'lucide-react';
import Link from 'next/link';

const page = () => {

  const [step, setStep] = useState<number>(1)
  const [canContinue, setCanContinue] = useState<boolean>(false)
  
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [account, setAccount] = useState<Account | null>(null)

  const { toast } = useToast()

  async function stepForward() {
    if (canContinue && ticket) {
      setCanContinue(false)
      setStep(step + 1)
      if (step === 4) {
        await accessAPI('/database/update', 'POST', {'path': `db/clients/tickets`, 'query': {'TicketID': ticket['TicketID']}, 'data': {'Status': 'Opened'}})
      }
    } else {
      let errorMessage = '';
      switch (step) {
        case 1:
          errorMessage = 'You must select one ticket to continue.';
          break;
        case 2:
          errorMessage = 'Must submit form information to continue.';
          break;
        case 3:
          errorMessage = 'AGM User must verify documents before continuing.';
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
    
    <div className='w-full h-fit gap-5 flex flex-col justify-center items-center'>

      {step == 1 && <TicketManager setTicket={setTicket} ticket={ticket} setCanContinue={setCanContinue}/>}

      {(step == 2 && ticket) && <OpenAccount ticket={ticket} setCanContinue={setCanContinue} setAccount={setAccount} account={account}/>}

      {(step == 3 && ticket) && <BackupDocuments ticket={ticket} setCanContinue={setCanContinue} canContinue={canContinue} account={account}/>}

      {(step == 4 && ticket) && <FillApplicationForm ticket={ticket} setCanContinue={setCanContinue}/>}

      {(step == 5 && ticket) && <Final />}

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

const Final = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='relative h-full w-full flex flex-col justify-center items-center gap-y-8 py-16'
    >
      <Confetti/>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Check className='w-24 h-24 text-green-500' />
      </motion.div>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='text-2xl font-semibold text-gray-700'
      >
        You have successfully opened a new account.
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className='flex flex-col items-center gap-y-4'
      >
        <Button asChild>
          <Link href='/dashboard/open-account'>Open another account</Link>
        </Button>
        <Button variant='ghost' asChild>
          <Link href='/'>Go back home</Link>
        </Button>
      </motion.div>
    </motion.div>
  )
}