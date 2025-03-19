'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import TicketManager from '@/components/dashboard/open_account/TicketManager';
import BackupDocuments from '@/components/dashboard/open_account/BackupDocuments';
import FillApplicationForm from '@/components/dashboard/open_account/FillApplicationForm';
import OpenAccount from '@/components/dashboard/open_account/OpenAccount';
import { Account } from '@/lib/entities/account';
import { Ticket } from '@/lib/entities/ticket';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { UpdateTicketByID } from '@/utils/entities/ticket';
import FinalPage from './FinalPage';
import { CreateNotification } from '@/utils/entities/notification';
import { formatTimestamp } from '@/utils/dates';
import { AccountApplicationNotification, Notification } from '@/lib/entities/notification';
import { useSession } from 'next-auth/react';

const AccountOpeningPage = () => {

  const [step, setStep] = useState<number>(1)
  const [canContinue, setCanContinue] = useState<boolean>(false)
  
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [account, setAccount] = useState<Account | null>(null)

  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const { toast } = useToast()
  const {data:session} = useSession()

  async function stepForward() {
    if (!session?.user?.email) throw new Error('Fatal error: No user email')

    if (canContinue && ticket) {
      setCanContinue(false)
      setStep(step + 1)

      if (step === 1) {
        const notification: AccountApplicationNotification = {
          Title: 'Opening account',
          NotificationID: formatTimestamp(new Date()),
          TicketID: ticket['TicketID'],
          AGMUser: session?.user?.email,
          TicketStatus: ticket['Status'],
          UserID: session?.user?.id
        }
        await CreateNotification(notification, 'account_applications')
      }

      if (step === 5) {
        const notification: AccountApplicationNotification = {
          Title: 'Account opened',
          NotificationID: formatTimestamp(new Date()),
          TicketID: ticket['TicketID'],
          AGMUser: session?.user?.email,
          TicketStatus: ticket['Status'],
          UserID: session?.user?.id
        }
        await CreateNotification(notification, 'account_applications')
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

  function finish() {
    setOpenDialog(false)
    stepForward()
  }

  function stepBackwards() {
    if (step > 1) {
      setStep(step - 1)
    }
  }
  
  return (
    <div className='w-full h-full flex flex-col gap-5'>
      <div className='flex-1'>
        {step == 1 && <TicketManager setTicket={setTicket} ticket={ticket} setCanContinue={setCanContinue}/>}

        {(step == 2 && ticket) && <OpenAccount ticket={ticket} setCanContinue={setCanContinue} setAccount={setAccount} account={account}/>}

        {(step == 3 && ticket) && <BackupDocuments ticket={ticket} setCanContinue={setCanContinue} canContinue={canContinue} account={account}/>}

        {(step == 4 && ticket) && <FillApplicationForm ticket={ticket} setCanContinue={setCanContinue}/>}

        {(step == 5 && ticket) && <FinalPage />}
      </div>

      {step < 5 && 
        <div className='flex justify-center pb-5'>
          <div className='h-fit w-fit flex gap-x-5'>
            {step > 1 && <Button onClick={stepBackwards}>Previous step.</Button>}
            {step === 4 ? 
              <div>
                <Button onClick={() => setOpenDialog(true)} variant='primary'>Finish.</Button> 
              </div>
              : 
              <Button onClick={(e) => stepForward()} variant={canContinue ? 'primary':'ghost'}>Next step.</Button>
            }
          </div>
        </div>
      }

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to finish?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={finish}>Finish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AccountOpeningPage

