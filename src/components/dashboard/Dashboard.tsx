"use client"
import React, {useState, useEffect} from 'react';
import { DocumentData } from 'firebase/firestore/lite';

import { addColumnsFromJSON, getDocumentsFromCollection } from '@/utils/api';
import { sortColumns } from '@/utils/table';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Sidebar from '@/components/dashboard/sidebar/Sidebar';
import { useSession } from 'next-auth/react';
import { DataTable } from '@/components/dashboard/components/DataTable';
import { Session, User } from 'next-auth';

type Props = {
    user:User
}

const Dashboard = ({user}: Props) => {

      // Initialize data variables
  const [tickets, setTickets] = useState<DocumentData[] | null>(null)

  // Ticket columns - export to dictionary!
  const columns = ['TicketID', 'Status', 'Advisor']

  // Fetch tickets from database
  useEffect(() => {

    async function fetchData () {
        let data = await getDocumentsFromCollection('db/clients/tickets/')
        setTickets(sortColumns(data, columns))
    }
    fetchData()

  }, [])


  return (

    <div className='flex flex-row w-full gap-x-5 mx-5'> {/*Sidebar separator*/}

        <Sidebar/>

        <div className='flex flex-col gap-y-10 justify-center items-center w-full h-full'>  {/*Create dashboard vertical sections*/}

        <div className='flex w-full gap-x-10 h-full flex-row'>

            <Card className="w-full bg-agm-dark-blue border-0 text-agm-white">
            <CardHeader>
                <CardTitle>
                <p className='text-3xl'>Assets Under Management</p>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-5xl text-agm-green'>45.33M</p>
            </CardContent>
            </Card>

            <Card className="w-full bg-agm-dark-blue border-0 text-agm-white">
            <CardHeader>
                <CardTitle>
                <p className='text-3xl'>New clients</p>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-5xl text-agm-green'>+3</p>
            </CardContent>
            </Card>

            <Card className="w-full bg-agm-dark-blue border-0 text-agm-white">
            <CardHeader>
                <CardTitle>
                <p className='text-3xl'>Profit in fees</p>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-5xl text-agm-green'>+$120</p>
            </CardContent>
            </Card>
        </div>

        <div className='flex w-full gap-x-5 flex-row'>
            <Card className="w-full bg-agm-dark-blue border-0 text-agm-white">
            <CardHeader>
                <CardTitle>
                <p className='text-3xl'>Welcome back,</p>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-7xl'>{user.name}</p>
            </CardContent>
            </Card>
        </div>

        
        <div className='flex w-full gap-x-5 flex-row'>
            <Card className="w-full bg-agm-dark-blue border-0 text-agm-white">
            <CardHeader>
                <CardTitle>
                <p className='text-3xl'>Open applications</p>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {tickets && <DataTable data={tickets} width={100}/>}
            </CardContent>
            </Card>
        </div>

        <div className='flex w-full gap-x-5 flex-row'>
            <Card className="w-full bg-agm-dark-blue border-0 text-agm-white">
            <CardHeader>
                <CardTitle>
                <p className='text-3xl'>Open applications</p>
                </CardTitle>
            </CardHeader>
            </Card>
            <Card className="w-full bg-agm-dark-blue border-0 text-agm-white">
            <CardHeader>
                <CardTitle>
                <p className='text-3xl'>Open applications</p>
                </CardTitle>
            </CardHeader>
            </Card>
            <Card className="w-full bg-agm-dark-blue border-0 text-agm-white">
            <CardHeader>
                <CardTitle>
                <p className='text-3xl'>Open applications</p>
                </CardTitle>
            </CardHeader>
            </Card>
        </div>

        <iframe title="Realtime Database Google" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=f1d81e10-b10b-4e48-92d7-f8e49e6800b1&autoAuth=true&ctid=34ef35c3-128b-4180-9d21-e764b0c7596d" allowFullScreen={true}></iframe>

        </div>
    </div>
  )
}

export default Dashboard