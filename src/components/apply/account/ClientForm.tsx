'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import GeneralInfo from './components/GeneralInfo';
import Regulatory from './components/Regulatory';
import AboutYou from './components/AboutYou';
import { StaticHeader } from '@/components/Header';
import ApplicationEnd from './components/ApplicationEnd';
import AuthorizedPerson from './components/AuthorizedPerson';
import AboutOrganization from './components/AboutOrganization';
import { pageTransition, pageVariants } from '@/lib/anims';
import { UpdateAccountInfoByID, ReadAccountInfoByID } from '@/utils/entities/account';
import { AccountPayload, IndividualAccountApplicationInfo } from '@/lib/entities/account';
import { Account } from '@/lib/entities/account';
import LoadingComponent from '@/components/misc/LoadingComponent';
import { useSearchParams } from 'next/navigation';

interface Props {
  accountProp: Account | null
}

const ClientForm = ({ accountProp }: Props) => {

  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const [step, setStep] = useState<number>(1);
  
  const [account, setAccount] = useState<Account | null>(accountProp || null);
  const [accountInfo, setAccountInfo] = useState<IndividualAccountApplicationInfo | null>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load account and account info if provided
  useEffect(() => {
    setLoading(true);
    setAccount(accountProp);

    if (accountProp) {
      ReadAccountInfoByID(accountProp.id).then((accountInfo: IndividualAccountApplicationInfo) => {
        setAccountInfo(accountInfo);
      });
    }

    setStep(1);
    setLoading(false);
  }, [accountProp]);

  // Sync account data with database on mount
  useEffect(() => {
    return () => {
      if (account && accountInfo) {
        syncAccountData(account.id, accountInfo).catch(console.error);
      }
    };
  }, []);

  console.log('accountInfo', accountInfo)

  // Prevent unsaved changes from being lost on page refresh
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

  // Sync account data with database (for updates)
  async function syncAccountData(accountID:string, accountInfo: IndividualAccountApplicationInfo) {
    try {
      console.log('accountInfo func', accountInfo)
      setIsSaving(true);
      await UpdateAccountInfoByID(accountID, accountInfo);
      setAccountInfo(accountInfo);
      toast({
        title: 'Progress Saved',
        description: 'Your application progress has been saved.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sync account data',
        variant: 'destructive',
      })
      return false;
    } finally {
      setIsSaving(false);
    }
    return true;
  }

  // Create new account and set state (for initial creation)
  async function handleCreateAccount(payload: AccountPayload, infoData: IndividualAccountApplicationInfo): Promise<Account | null> {
    /*
    try {

      // First create the account to get IDs
      const { accountID, infoID } = await CreateAccount(payload, infoData);
      console.log('accountID', accountID)

      const account = await ReadAccountByAccountID(accountID);
      const accountInfo = await ReadAccountInfoByID(infoID);

      setAccount(account);
      setAccountInfo(accountInfo);
      
      toast({
        title: 'Application Started',
        description: 'Your application has been successfully started.',
        variant: 'success',
      });
      
      return account;
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create account',
        variant: 'destructive',
      });
      return null;
    }
    */
   return null;
  }

  const stepForward = () => {
    if (isSaving) return;
    
    // Validate current step data before moving forward
    if (!account && step !== 1) {
      toast({
        title: 'Error',
        description: 'No account data available',
        variant: 'destructive',
      });
      return;
    }

    setStep(step + 1);
    scrollToTop();
  };

  const stepBackward = () => {
    if (isSaving || step < 2) return;
    setStep(step - 1);
    scrollToTop();
  };

  const isBrowser = () => typeof window !== 'undefined';
  
  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function handleRefresh() {
    if (isSaving) return;
    
    const confirmRefresh = window.confirm("slkdgh;sng;ksdg;kj");
    if (confirmRefresh) {
      setStep(1);
      setAccount(null);
    }
  };

  const renderFormStep = () => {

    if (!account) {
      if (step === 1) {
        return (
          <GeneralInfo 
            account={account}
            accountInfo={accountInfo}
            stepForward={stepForward} 
            syncAccountData={syncAccountData}
            createAccount={handleCreateAccount}
          />
        );
      }
      return null;
    }

    if (account.account_type === 'Individual' && accountInfo) {
      switch (step) {
        case 1:
          return (
            <GeneralInfo 
              account={account}
              accountInfo={accountInfo}
              stepForward={stepForward} 
              syncAccountData={syncAccountData}
              createAccount={handleCreateAccount}
            />
          );
        case 2:
          return (
            <AboutYou 
              primary 
              account={account} 
              accountInfo={accountInfo}
              stepForward={stepForward} 
              stepBackward={stepBackward}
              syncAccountData={syncAccountData}
            />
          );
        case 3:
          return (
            <Regulatory 
              account={account}
              accountInfo={accountInfo}
              stepForward={stepForward} 
              stepBackwards={stepBackward}
              syncAccountData={syncAccountData}
            />
          );
        case 4:
          return <ApplicationEnd />;
        default:
          return null;
      }
    }

    if (account.account_type === 'Joint' && accountInfo) {
      switch (step) {
        case 1:
          return (
            <GeneralInfo 
              account={account}
              accountInfo={accountInfo}
              stepForward={stepForward} 
              syncAccountData={syncAccountData}
              createAccount={handleCreateAccount}
            />
          );
        case 2:
          return (
            <AboutYou 
              primary 
              account={account} 
              accountInfo={accountInfo}
              stepForward={stepForward} 
              stepBackward={stepBackward}
              syncAccountData={syncAccountData}
            />
          );
        case 3:
          return (
            <AboutYou 
              primary={false} 
              account={account} 
              accountInfo={accountInfo}
              stepForward={stepForward} 
              stepBackward={stepBackward}
              syncAccountData={syncAccountData}
            />
          );
        case 4:
          return (
            <Regulatory 
              account={account} 
              accountInfo={accountInfo}
              stepForward={stepForward} 
              stepBackwards={stepBackward}
              syncAccountData={syncAccountData}
            />
          );
        case 5:
          return <ApplicationEnd />;
        default:
          return null;
      }
    }

    if (account.account_type === 'Institutional' && accountInfo) {
      switch (step) {
        case 1:
          return (
            <GeneralInfo 
              account={account}
              accountInfo={accountInfo}
              stepForward={stepForward} 
              syncAccountData={syncAccountData}
              createAccount={handleCreateAccount}
            />
          );
        case 2:
          return (
            <AboutOrganization
              stepBackward={stepBackward}
              account={account}
              accountInfo={accountInfo}
              stepForward={stepForward}
              syncAccountData={syncAccountData}
            />
          );
        case 3:
          return (
            <AuthorizedPerson
              stepBackward={stepBackward}
              account={account}
              accountInfo={accountInfo}
              stepForward={stepForward}
              syncAccountData={syncAccountData}
            />
          );
        case 4:
          return (
            <Regulatory
              account={account}
              accountInfo={accountInfo}
              stepForward={stepForward}
              stepBackwards={stepBackward}
              syncAccountData={syncAccountData}
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

  if (loading) {
    return (
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col h-full'>
      <StaticHeader/>
      <div className='w-full h-fit flex flex-col justify-center items-center'>
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