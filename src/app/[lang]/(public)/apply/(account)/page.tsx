'use client'
import React, { useState } from 'react';
import Title from '@/components/apply/title/Title';
import IBKRApplicationForm from '@/components/apply/form/IBKRApplicationForm';

const page = () => {
  const [started, setStarted] = useState(false)

  if (started) {
    return <IBKRApplicationForm />
  }
  else {
    return <Title setStarted={setStarted}/>
  }
}

export default page