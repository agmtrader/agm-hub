'use client'
import React, { useState } from 'react';
import Title from '@/components/hub/apply/Title';
import IBKRApplicationForm from '@/components/hub/apply/IBKRApplicationForm';

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