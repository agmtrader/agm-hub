'use client'

import React, { useState } from 'react';
import ClientForm from '@/components/apply/ClientForm';
import Title from '@/components/apply/account/title/Title';
import Header from '@/components/apply/Header';

const page = () => {

  const [started, setStarted] = useState(false)

  return (
    <div className='w-full h-full flex flex-col justify-center items-start'>

      <Header dark={!started} bg={started}/>

      {started ? 

        <ClientForm />
        :
        <Title setStarted={setStarted}/>
        
      }
      
    </div>
)}

export default page