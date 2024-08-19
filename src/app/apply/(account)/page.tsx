'use client'

import React, { useState } from 'react';
import ClientForm from '@/components/apply/ClientForm';
import Title from '@/components/apply/account/title/Title';

const page = () => {

  const [started, setStarted] = useState(true)

  return (
    <div className='w-full h-full flex flex-col justify-center items-start'>

      {started ? 

        <ClientForm />
        :
        <Title setStarted={setStarted}/>
        
      }
      
    </div>
)}

export default page