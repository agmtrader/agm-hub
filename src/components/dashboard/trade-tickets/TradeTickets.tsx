'use client'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trade, tradeTickets } from '@/lib/entities/trade-ticket'
import { ColumnDefinition, DataTable } from '@/components/dashboard/components/DataTable'
import { useToast } from '@/hooks/use-toast'
import DashboardPage from '@/components/misc/DashboardPage'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { FetchTrades, GenerateTradeTicket, SendToClient } from '@/utils/entities/trade-tickets'

interface Params {
  flexQueryIdParam?: string
}

export default function TradeTickets({flexQueryIdParam}: Params) {

    const [flexQueryId, setFlexQueryId] = useState<string | null>(flexQueryIdParam || null)
    const [trades, setTrades] = useState<Trade[] | null>(null)

    const [selectedTrades, setSelectedTrades] = useState<Trade[]>([])
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

    // Fetch flex queries
    useEffect(() => {
      handleFetchTrades()
    }, [flexQueryId])

    // Let the user know that we are creating a consolidated trade ticket
    useEffect(() => {
      if (selectedTrades.length > 1) {
        toast({
          title: 'Creating Consolidated Trade Ticket',
        })
      }
    }, [selectedTrades])

    async function handleFetchTrades() {
      if (!flexQueryId) return;
      const trades = await FetchTrades(flexQueryId)
      setTrades(trades)
    }

    async function handleGenerateTradeTicket() {
      if (!trades || !selectedTrades) return;
      try {
        const message = await GenerateTradeTicket(trades, selectedTrades)
        setClientMessage(message)
      } catch (error: any) {
        toast({
          title: 'Error generating trade ticket',
          description: error.message,
        })
      }
    }

    async function handleSendToClient() {
      if (!clientMessage) return;
      await SendToClient(clientMessage)
      setConfirmDialogOpen(false)
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
              {tradeTickets.map((tradeTicket) => (
                <SelectItem className='p-2' key={tradeTicket.id} value={tradeTicket.id}>{tradeTicket.name} - {tradeTicket.user_id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }

        <ResizablePanelGroup direction="horizontal" className="gap-2 w-full h-full">
          <ResizablePanel defaultSize={50} className='flex flex-col gap-5 w-full h-full justify-start items-start'>
            <div className='w-full h-full flex flex-col gap-5 justify-start items-start'>
              <DataTable 
                data={trades || []}
                columns={columns}
                enableSelection 
                setSelection={setSelectedTrades} 
                infiniteScroll
                enableFiltering
                filterColumns={['Description']}
              />
              <Button disabled={selectedTrades.length === 0} className='w-fit' onClick={() => handleGenerateTradeTicket()}>
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
            <Button onClick={() => handleSendToClient()}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPage>
  )
}
