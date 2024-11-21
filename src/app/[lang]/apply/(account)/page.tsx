'use client'
import React, { useState } from 'react';
import ClientForm from '@/components/apply/account/ClientForm';
import Title from '@/components/apply/account/title/Title';
import { useSession } from 'next-auth/react';
import { formatURL } from '@/utils/lang';
import { redirect } from 'next/navigation';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';

const page = () => {

  const [started, setStarted] = useState(false)

  if (started) {
    return <ClientForm />
  }
  else {
    return <Title setStarted={setStarted}/>
  }
}

export default page