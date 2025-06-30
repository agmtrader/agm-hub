'use client'
import React, { useEffect, useState } from 'react';
import Title from '@/components/apply/title/Title';
import { Account } from '@/lib/entities/account';
import { redirect, useSearchParams } from 'next/navigation';
import { ReadAccountByLeadID } from '@/utils/entities/account';
import { useToast } from '@/hooks/use-toast';
import { formatURL } from '@/utils/language/lang';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import IBKRApplicationForm from '@/components/apply/form/IBKRApplicationForm';

const page = () => {

  const { toast } = useToast()

  const [started, setStarted] = useState(false)
  const [account, setAccount] = useState<Account | null>(null)

    const searchParams = useSearchParams()
    const lead_id = searchParams.get('ld') || null;

    const { lang } = useTranslationProvider()

    useEffect(() => {
      async function checkLead() {
        if (lead_id) {
          try {
            const account = await ReadAccountByLeadID(lead_id)
            if (account) {
              throw new Error('Account already exists for this Lead. Please contact support for more information.')
            } else {
              setStarted(true)
            }
          } catch (error) {
            toast({
              title: 'Error',
              description: error instanceof Error ? error.message : 'Failed to load lead',
              variant: 'destructive',
            })
            redirect(formatURL('/', lang))
          }
        }
      }
      checkLead()
    }, [lead_id])

  if (started) {
    return <IBKRApplicationForm />
  }
  else {
    return <Title setStarted={setStarted} setAccount={setAccount}/>
  }
}

export default page