'use client'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { accessAPI } from '@/utils/api'
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from '@/components/ui/scroll-area'
import { ColumnDefinition, DataTable } from '@/components/dashboard/components/DataTable'
import { useToast } from '@/hooks/use-toast'
import DashboardPage from '@/components/misc/DashboardPage'
import LoadingComponent from '@/components/misc/LoadingComponent'

export default function TradeTickets() {

    const [flexQueryId, setFlexQueryId] = useState<string | null>(null)
    const [flexQuery, setFlexQuery] = useState<any[] | null>(null)
    const [selectedTrades, setSelectedTrades] = useState<any[]>([])
    const [clientMessage, setClientMessage] = useState<string | null>(null)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

    const { toast } = useToast()

    const flexQueryIds = [
      {
        name: 'ACOBO',
        user_id: 'U1213465',
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

    useEffect(() => {
      if (flexQueryId) {
        fetchFlexQuery()
      }
    }, [flexQueryId])

    useEffect(() => {
      if (selectedTrades.length > 1) {
        toast({
          title: 'Creating Consolidated Trade Ticket',
        })
      }
    }, [selectedTrades])

    async function fetchFlexQuery() {
      if (!flexQueryId) return;

      const response = await accessAPI('/flex_query/fetch', 'POST', {'queryIds': [flexQueryId]})
      if (response['status'] !== 'success') {
        throw new Error(response['content'])
      }
      const trades = response['content'][flexQueryId as string]
      trades.sort((a: any, b: any) => {
        const dateA = new Date(a['Date/Time']).getTime()
        const dateB = new Date(b['Date/Time']).getTime()
        return dateB - dateA
      })
      setFlexQuery(trades)
    }

    async function generateTradeTicket() {

      if (!flexQuery) return;

        // Check if all selected trades have the same description
        const firstSymbol = selectedTrades[0]?.Symbol;
        const allSameSymbol = selectedTrades.every(trade => trade.Symbol === firstSymbol);
        
        if (!allSameSymbol) {
          toast({
            title: 'Error',
            description: 'All selected trades must be for the same symbol',
            variant: 'destructive'
          })
          return;
        }

      const selectedIndices = selectedTrades.map(selectedTrade => 
        flexQuery.findIndex(trade => 
          trade['Date/Time'] === selectedTrade['Date/Time'] && 
          trade['Description'] === selectedTrade['Description'] &&
          trade['Quantity'] === selectedTrade['Quantity']
        )
      ).filter(index => index !== -1);
      console.log(selectedIndices)

      let response = await accessAPI('/trade_tickets/generate_trade_ticket', 'POST', {
        'flex_query_dict': flexQuery,
        'indices': selectedIndices.join(',')
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
      const response = await accessAPI('/email/send_client_email', 'POST', {
        'plain_text': clientMessage, 
        'client_email': clientEmails, 
        'subject': 'Confirmación de Transacción'
      })
      if (response['status'] === 'error') {
        throw new Error(response['content'])
      }
    }

  return (
    <DashboardPage title='Trade Tickets' description='Generate trade tickets for clients'>
      <Select onValueChange={(value) => setFlexQueryId(value)}>
        <SelectTrigger className="w-fit gap-2">
          <SelectValue placeholder="Select Account" />
        </SelectTrigger>
        <SelectContent>
          {flexQueryIds.map((flexQuery) => (
            <SelectItem className='p-2' key={flexQuery.id} value={flexQuery.id}>{flexQuery.name} - {flexQuery.user_id}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-10 justify-center items-center">

        {flexQueryId ?
            flexQuery ?
              <div className='flex flex-col gap-5 w-full h-full justify-center items-center'>
                <DataTable 
                  data={flexQuery}
                  columns={columns} 
                  enableSelection 
                  setSelection={setSelectedTrades} 
                  enablePagination 
                  enableFiltering
                  filterColumns={['Description']}
                />
                <Button disabled={selectedTrades.length === 0} className='w-fit' onClick={generateTradeTicket}>
                  Generate Trade Ticket
                </Button>
              </div>
            :
            <LoadingComponent className='h-full w-full'/>
          :
          <p className='text-foreground text-center'>Select an account to view trades</p>
        }

        {clientMessage &&
          <div className='w-full text-foreground h-full flex flex-col gap-y-5 justify-center items-center'>
            <Textarea 
              value={clientMessage} 
              readOnly 
              placeholder="Generated report will appear here..."
              className="h-[60vh] w-full"
            />
            <Button className='w-fit' onClick={() => setConfirmDialogOpen(true)}>
              Send to Client
            </Button>
          </div>
        }


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
    </DashboardPage>
  )
}
