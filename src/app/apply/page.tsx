'use client'

import React, { useState } from 'react';
import ClientForm from '@/components/apply/ClientForm';
import { Button } from '@/components/ui/button';
import Title from '@/components/apply/title/Title';

const page = () => {

  const [started, setStarted] = useState(false)

  return (
    <div className='w-full h-full flex flex-col justify-center items-start'>

      {started ? 

        <ClientForm/>
        :
        <Title setStarted={setStarted}/>
        
      }
      
    </div>
)}

export default page