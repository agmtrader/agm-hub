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

import { useSession } from 'next-auth/react';
import { DataTable } from '@/components/dashboard/components/DataTable';
import { Drill } from 'lucide-react';

export const Dashboard = () => {

    const {data:session} = useSession()

    // Initialize data variables
  const [tickets, setTickets] = useState<DocumentData[] | null>(null)

  // Ticket columns - export to dictionary!
  const columns = ['TicketID', 'Status', 'first_name', 'last_name']

  // Fetch tickets from database
  useEffect(() => {

    async function fetchData () {
        let data = await getDocumentsFromCollection('db/clients/tickets/')
        data = await addColumnsFromJSON(data)
        setTickets(sortColumns(data, columns))
    }
    fetchData()

  }, [])


  return (

    <div className='flex flex-row justify-center items-start w-full gap-x-5'> {/*Sidebar separator*/}

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
                    {session && <p className='text-7xl'>{session.user.name}</p>}
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
                        <p className='text-3xl'>PowerBI Report</p>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <iframe title="Realtime Database Google" width="100%" height="500px" src="https://app.powerbi.com/reportEmbed?reportId=f1d81e10-b10b-4e48-92d7-f8e49e6800b1&autoAuth=true&ctid=34ef35c3-128b-4180-9d21-e764b0c7596d" allowFullScreen={true}></iframe>
                </CardContent>
                </Card>
            </div>

        </div>

    </div>
  )
}

export const ClientDashboard = () => {


  return (

    <div className='flex flex-row justify-center h-[60vh] items-start w-full gap-x-5'> {/*Sidebar separator*/}

        <div className='flex flex-col text-agm-white text-center gap-y-10 justify-center items-center w-[50%] h-full'>  {/*Create dashboard vertical sections*/}
            <Drill size={100}/>
            <p className='text-7xl font-bold'>Work in progress.</p>
            <p className='text-xl font-light'>The AGM Client dashboard is currently in development, please check back later.</p>
        </div>

    </div>
  )
}

