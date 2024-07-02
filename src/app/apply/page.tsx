'use client'

import React, { useState } from 'react';
import ClientForm from '@/components/apply/ClientForm';
import { Button } from '@/components/ui/button';

const page = () => {

  const [started, setStarted] = useState(false)

  return (
    <div className='w-full h-full flex flex-col justify-center items-start'>
      {started ? 
        <ClientForm/>
        :
        <div className='w-full h-[100vh] flex flex-col justify-center items-center'>
          <Button onClick={() => setStarted(true)}>Get started.</Button>
        </div>
      }
    </div>
)}

export default page