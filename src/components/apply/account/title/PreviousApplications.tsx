import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { Ticket } from '@/lib/entities/ticket'
import { ColumnDefinition, DataTable } from '@/components/misc/DataTable'
import { ReadTicketByUserID } from '@/utils/entities/ticket'

type Props = {
    setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>
    setStarted: React.Dispatch<React.SetStateAction<boolean>>
}

const PreviousApplications = ({setTicket, setStarted}:Props) => {

    const [dialogOpen, setDialogOpen] = useState(false)

    const {data:session} = useSession()
    const [previousTickets, setPreviousTickets] = useState<Ticket[]>([])

    useEffect(() => {
        async function getPreviousTickets() {
            if (!session?.user?.id) throw new Error('User not found')
            let tickets = await ReadTicketByUserID(session?.user?.id)
            console.log(tickets)
            tickets = tickets.filter((ticket) => ticket.Status === 'Started')
            setPreviousTickets(tickets)
        }   
        getPreviousTickets()
    }, [session])


    if (!previousTickets) return null


    const columns = [
        {
            header: 'Status',
            accessorKey: 'Status',
        },
        {
            header: 'Start Date',
            accessorKey: 'id',
        },
    ] as ColumnDefinition<any>[]

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
            <Button
                variant="ghost"
                className="text-sm rounded-full"
            >
                <p>View previous applications</p>
            </Button>
        </DialogTrigger>
        <DialogContent className='w-full max-w-5xl'>
            <DialogHeader>
                <DialogTitle>Previous Applications</DialogTitle>
            </DialogHeader>
            <DataTable data={previousTickets} columns={columns} rowActions={[
                {
                    label: 'Resume',
                    onClick: (ticket: Ticket) => {
                        setDialogOpen(false)
                        setTicket(null)
                        setStarted(false)
                        setTimeout(() => {
                            setTicket(ticket)
                            setStarted(true)
                        }, 100)
                    }
                }
            ]} enableRowActions/>
        </DialogContent>
    </Dialog>
  )
}

export default PreviousApplications