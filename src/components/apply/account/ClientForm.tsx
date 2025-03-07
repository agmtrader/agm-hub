'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import GeneralInfo from './components/GeneralInfo';
import Regulatory from './components/Regulatory';
import { Ticket } from '@/lib/entities/ticket';
import AboutYou from './components/AboutYou';
import { StaticHeader } from '@/components/Header';
import ApplicationEnd from './components/ApplicationEnd';
import AuthorizedPerson from './components/AuthorizedPerson';
import AboutOrganization from './components/AboutOrganization';
import { UpdateTicketByID } from '@/utils/entities/ticket';
import { Loader2 } from 'lucide-react';
import { pageTransition, pageVariants } from '@/lib/anims';

interface Props {
  ticketProp: Ticket | null
}

const ClientForm = ({ticketProp}: Props) => {

  const { toast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [ticket, setTicket] = useState<Ticket | null>(ticketProp || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    setTicket(ticketProp);
    setStep(1);
  }, [ticketProp]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Save any unsaved changes when component unmounts
      if (ticket) {
        syncTicketData(ticket).catch(console.error);
      }
    };
  }, []);

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isSaving) {
        event.preventDefault();
        event.returnValue = "Changes are being saved. Are you sure you want to leave?";
        return event.returnValue;
      }
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave? Your progress may be lost.";
      return event.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSaving]);

  // Sync ticket data with database
  async function syncTicketData(updatedTicket: Ticket) {
    try {
      setIsSaving(true);
      await UpdateTicketByID(updatedTicket.TicketID, updatedTicket);
      setTicket(updatedTicket);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sync ticket data',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
    return true;
  };

  const stepForward = () => {
    if (isSaving || isLoading) return;
    
    // Validate current step data before moving forward
    if (!ticket && step !== 1) {
      toast({
        title: 'Error',
        description: 'No ticket data available',
        variant: 'destructive',
      });
      return;
    }

    setStep(step + 1);
    scrollToTop();
  };

  const stepBackward = () => {
    if (isSaving || isLoading || step < 2) return;
    setStep(step - 1);
    scrollToTop();
  };

  const isBrowser = () => typeof window !== 'undefined';
  
  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function handleRefresh() {
    if (isSaving || isLoading) return;
    
    const confirmRefresh = window.confirm("Are you sure you want to refresh? This will delete your current progress.");
    if (confirmRefresh) {
      setStep(1);
      setTicket(null);
    }
  };

  const renderFormStep = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center w-full h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }

    if (!ticket) {
      if (step === 1) {
        return (
          <GeneralInfo 
            ticket={ticket}
            stepForward={stepForward} 
            setTicket={setTicket}
            syncTicketData={syncTicketData}
          />
        );
      }
      return null;
    }

    if (ticket.ApplicationInfo.account_type === 'Individual') {
      switch (step) {
        case 1:
          return (
            <GeneralInfo 
              ticket={ticket}
              stepForward={stepForward} 
              setTicket={setTicket}
              syncTicketData={syncTicketData}
            />
          );
        case 2:
          return (
            <AboutYou 
              primary 
              ticket={ticket} 
              setTicket={setTicket} 
              stepForward={stepForward} 
              stepBackward={stepBackward}
              syncTicketData={syncTicketData}
            />
          );
        case 3:
          return (
            <Regulatory 
              ticket={ticket} 
              setTicket={setTicket} 
              stepForward={stepForward} 
              stepBackwards={stepBackward}
              syncTicketData={syncTicketData}
            />
          );
        case 4:
          return <ApplicationEnd />;
        default:
          return null;
      }
    }

    if (ticket.ApplicationInfo.account_type === 'Joint') {
      switch (step) {
        case 1:
          return (
            <GeneralInfo 
              ticket={ticket}
              stepForward={stepForward} 
              setTicket={setTicket}
              syncTicketData={syncTicketData}
            />
          );
        case 2:
          return (
            <AboutYou 
              primary 
              ticket={ticket} 
              setTicket={setTicket} 
              stepForward={stepForward} 
              stepBackward={stepBackward}
              syncTicketData={syncTicketData}
            />
          );
        case 3:
          return (
            <AboutYou 
              primary={false} 
              ticket={ticket} 
              setTicket={setTicket} 
              stepForward={stepForward} 
              stepBackward={stepBackward}
              syncTicketData={syncTicketData}
            />
          );
        case 4:
          return (
            <Regulatory 
              ticket={ticket} 
              setTicket={setTicket} 
              stepForward={stepForward} 
              stepBackwards={stepBackward}
              syncTicketData={syncTicketData}
            />
          );
        case 5:
          return <ApplicationEnd />;
        default:
          return null;
      }
    }

    if (['Institutional'].includes(ticket.ApplicationInfo.account_type)) {
      switch (step) {
        case 1:
          return (
            <GeneralInfo 
              ticket={ticket}
              stepForward={stepForward} 
              setTicket={setTicket}
              syncTicketData={syncTicketData}
            />
          );
        case 2:
          return (
            <AboutOrganization
              stepBackward={stepBackward}
              ticket={ticket}
              setTicket={setTicket}
              stepForward={stepForward}
              syncTicketData={syncTicketData}
            />
          );
        case 3:
          return (
            <AuthorizedPerson
              stepBackward={stepBackward}
              ticket={ticket}
              setTicket={setTicket}
              stepForward={stepForward}
              syncTicketData={syncTicketData}
            />
          );
        case 4:
          return (
            <Regulatory
              ticket={ticket}
              setTicket={setTicket}
              stepForward={stepForward}
              stepBackwards={stepBackward}
              syncTicketData={syncTicketData}
            />
          );
        case 5:
          return <ApplicationEnd />;
        default:
          return null;
      }
    }

    return null;
  };

  return (
    <div className='w-full flex flex-col h-full'>
      <StaticHeader/>
      <div className='w-full h-fit flex flex-col justify-center items-center'>
        {isSaving && (
          <div className="fixed top-0 left-0 right-0 bg-primary/10 p-2 text-center">
            <span className="text-sm text-primary flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving changes...
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className='w-full max-w-xl p-5 h-fit flex flex-col justify-center items-center pb-10'
          >
            {renderFormStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClientForm;