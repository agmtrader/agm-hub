"use client"
import React from 'react'

import { DocumentData } from 'firebase/firestore'
import { DataTable } from '../components/DataTable'
import TempEmailForm from './components/TempEmailForm'
import AccountNumberForm from './components/AccountNumberForm'

interface Props {
  currentTicket:DocumentData, 
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>
}

const OpenAccount = ({currentTicket, setCanContinue}:Props) => {

  return (
    <div className='h-full w-full flex flex-col justify-start gap-y-10 items-center'>
        <h1 className='text-7xl font-bold'>Create a temporary email.</h1>

        <DataTable data={[currentTicket]}/>
        <TempEmailForm currentTicket={currentTicket} setCanContinue={setCanContinue}/>

        <h1 className='text-3xl'>Open user's account and save account number.</h1>
        <AccountNumberForm currentTicket={currentTicket} setCanContinue={setCanContinue}/>

    </div>
  )
}

export default OpenAccount