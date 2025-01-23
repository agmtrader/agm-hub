'use client'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { accessAPI } from '@/utils/api'
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { flexQueryIds } from '@/lib/trade-tickets'
import { ColumnDefinition, DataTable } from '@/components/dashboard/components/DataTable'
import { useToast } from '@/hooks/use-toast'
import DashboardPage from '@/components/misc/DashboardPage'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

interface Params {
  flexQueryIdParam?: string
}

export default function TradeTickets({flexQueryIdParam}: Params) {

    const [flexQueryId, setFlexQueryId] = useState<string | null>(flexQueryIdParam || null)
    const [flexQuery, setFlexQuery] = useState<any[] | null>(null)
    const [selectedTrades, setSelectedTrades] = useState<any[]>([])
    const [clientMessage, setClientMessage] = useState<string | null>(null)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

    const { toast } = useToast()

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

    async function fetchFlexQuery() {
      try {
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
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch flex query',
          variant: 'destructive'
        })
      }
    }

    // Let the user know that we are creating a consolidated trade ticket
    useEffect(() => {
      if (selectedTrades.length > 1) {
        toast({
          title: 'Creating Consolidated Trade Ticket',
        })
      }
    }, [selectedTrades])

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
      
      <div className='w-full h-full flex flex-col gap-5'>
        {!flexQueryIdParam && 
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
        }

        <ResizablePanelGroup direction="horizontal" className="gap-2 w-full h-full">
          <ResizablePanel defaultSize={50} className='flex flex-col gap-5 w-full h-full justify-start items-start'>
            <div className='w-full h-full flex flex-col gap-5 justify-start items-start'>
              <DataTable 
                data={flexQuery || []}
                columns={columns}
                enableSelection 
                setSelection={setSelectedTrades} 
                infiniteScroll
                enableFiltering
                filterColumns={['Description']}
              />
              <Button disabled={selectedTrades.length === 0} className='w-fit' onClick={generateTradeTicket}>
                Generate Trade Ticket
              </Button>
            </div>
          </ResizablePanel>
          <ResizableHandle className='w-0.5 h-full bg-muted'/>
          <ResizablePanel defaultSize={50}>
            <div className='w-full text-foreground h-full flex flex-col gap-y-5 justify-start items-start'>
              <Textarea 
                value={clientMessage || ''} 
                readOnly 
                placeholder="Generated report will appear here..."
                className="h-full w-full text-md"
              />
              <Button className='w-fit' disabled={!clientMessage} onClick={() => setConfirmDialogOpen(true)}>
                Send to Client
              </Button>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
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
    </DashboardPage>
  )
}
