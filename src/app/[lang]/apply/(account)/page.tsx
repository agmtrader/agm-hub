'use client'

import React, { useState } from 'react';
import ClientForm from '@/components/apply/ClientForm';
import Title from '@/components/apply/account/title/Title';

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