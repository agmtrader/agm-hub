"use client"
import React from 'react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { formatURL } from '@/utils/language/lang';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';

const page = () => {

  const { data:session } = useSession()
  const { lang } = useTranslationProvider()

  return (
    <Dashboard/> 
  )
}

export default page