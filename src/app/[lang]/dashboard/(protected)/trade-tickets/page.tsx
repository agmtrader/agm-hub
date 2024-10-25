'use client'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ReloadIcon } from "@radix-ui/react-icons"
import { accessAPI } from '@/utils/api'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { ScrollArea } from '@/components/ui/scroll-area'
import { ColumnDefinition, DataTable } from '@/components/dashboard/components/DataTable'

export default function TradeTickets() {

    const [ticketId, setTicketId] = useState<string | null>(null)

    const [ticket, setTicket] = useState<any[] | null>(null)
    const [clientMessage, setClientMessage] = useState<string | null>(null)

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

    useEffect(() => {
      if (ticketId) {
        fetchTickets()
      }
    }, [ticketId])


    async function fetchTickets() {
      if (!ticketId) return;
      const response = await accessAPI('/flex_query/fetch', 'POST', {'queryIds': [ticketId]})
      if (response['status'] === 'error') {
        throw new Error(response['content'])
      }
      else {
        setTicket(response['content'][ticketId as string])
      }
    }

    async function generateTradeTicket() {
      if (!ticket) return;
      let response = await accessAPI('/trade_tickets/generate_trade_ticket', 'POST', {
        'flex_query_dict': ticket,
        'indices': "1"
      });
      response = await accessAPI('/trade_tickets/generate_client_confirmation_message', 'POST', {'trade_data': response['content']});
      if (response['status'] === 'error') {
        throw new Error(response['content']);
      } else {
        setClientMessage(response['content']['message']);
      }
    }

    async function sendToClient() {
      if (!clientMessage) return;
      const clientEmails = "lchavarria@acobo.com, arodriguez@acobo.com, rcontreras@acobo.com"
      //const clientEmails = "aa@agmtechnology.com"
      const response = await accessAPI('/email/send_client_email', 'POST', {'data': clientMessage, 'client_email': clientEmails, 'subject': 'Confirmación de Transacción'})
      if (response['status'] === 'error') {
        throw new Error(response['content'])
      }
    }

    const ticketIds = [
      {
        name: 'ACOBO',
        id: '986431'
      }
    ]

    const columns: ColumnDefinition<any>[] = [
      {
        header: 'Description',
        accessorKey: 'Description',
      },
      {
        header: 'AssetClass',
        accessorKey: 'AssetClass',
      },
      {
        header: 'Quantity',
        accessorKey: 'Quantity',
      },
      {
        header: 'Price',
        accessorKey: 'Price',
      },
      {
        header: 'Date/Time',
        accessorKey: 'Date/Time',
      }
    ]

  return (
    <div className="w-full h-full flex flex-col gap-y-10 justify-center items-center">
      
      <h1 className="text-7xl text-foreground font-bold">Generate Trade Tickets</h1>

      <div className="flex gap-10 justify-center items-center">

        <div className='w-full flex flex-col gap-5 justify-center items-center'>
          
          <Select onValueChange={(value) => setTicketId(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a ticket" />
            </SelectTrigger>
            <SelectContent>
              {ticketIds.map((ticket) => (
                <SelectItem key={ticket.id} value={ticket.id}>{ticket.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className='w-full h-fit flex flex-col gap-y-5 justify-center items-center'>
            <p className='text-subtitle'>Please select one or more tickets to generate trade tickets for. All tickets must be of the same symbol.</p>
            <ScrollArea className='w-full h-full flex justify-center items-center'>
              {ticket && <DataTable columns={columns} enableSelection data={ticket}/>}
            </ScrollArea>
            <Button onClick={generateTradeTicket}>
              Generate Trade Ticket
            </Button>
          </div>

          <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Send to Client</DialogTitle>
                <DialogDescription>
                  Make sure you have reviewed the trade ticket before sending it to the client.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => { sendToClient(); setConfirmDialogOpen(false); }}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {clientMessage &&
          <div className='w-full text-foreground h-full flex flex-col gap-y-5 justify-center items-center'>
            <Textarea 
              value={clientMessage} 
              readOnly 
              placeholder="Generated report will appear here..."
              className="h-full w-full"
            />
            <Button className='w-fit' onClick={() => setConfirmDialogOpen(true)}>
              Send to Client
            </Button>
          </div>
        }

      </div>

    </div>
  )
}
