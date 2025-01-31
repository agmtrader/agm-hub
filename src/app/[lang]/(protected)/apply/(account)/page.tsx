'use client'
import React, { useState } from 'react';
import ClientForm from '@/components/apply/account/ClientForm';
import Title from '@/components/apply/account/title/Title';
import { Ticket } from '@/lib/types';

const page = () => {

  const [started, setStarted] = useState(false)
  const [ticket, setTicket] = useState<Ticket | null>(null)

  if (started) {
    return <ClientForm ticketProp={ticket}/>
  }
  else {
    return <Title setStarted={setStarted} setTicket={setTicket}/>
  }
}

export default page