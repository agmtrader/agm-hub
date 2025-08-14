'use client'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trade, TradeTicket } from '@/lib/tools/trade-ticket'
import { ColumnDefinition, DataTable } from '@/components/misc/DataTable'
import { useToast } from '@/hooks/use-toast'
import DashboardPage from '@/components/misc/DashboardPage'
import { FetchTradeTicket, GenerateTradeTicketConfirmationMessage, SendToClient, ListTradeTickets } from '@/utils/tools/trade-tickets'

export default function TradeTickets() {

    const [tradeTickets, setTradeTickets] = useState<TradeTicket[]>([])
    const [isLoadingTickets, setIsLoadingTickets] = useState(true)

    const [selectedTradeTicketID, setSelectedTradeTicketID] = useState<string | null>(null)

    const [trades, setTrades] = useState<Trade[] | null>(null)
    const [selectedTrades, setSelectedTrades] = useState<Trade[]>([])

    const [generatingMessage, setGeneratingMessage] = useState(false)
    const [clientMessage, setClientMessage] = useState<string | null>(null)
    
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [sending, setSending] = useState(false)

    const { toast } = useToast()

    const columns: ColumnDefinition<Trade>[] = [
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

    // Fetch trade tickets list and their details
    useEffect(() => {
      async function fetchTradeTicketsAndDetails() {
        try {
          setIsLoadingTickets(true)
          const tradeTickets = await ListTradeTickets()
          setTradeTickets(tradeTickets)
        } catch (error: any) {
          toast({
            title: 'Error fetching trade tickets',
            description: error.message,
            variant: 'destructive',
          })
        } finally {
          setIsLoadingTickets(false)
        }
      }
      fetchTradeTicketsAndDetails()
    }, [])

    // Fetch flex queries
    useEffect(() => {
      handleFetchTrades()
    }, [selectedTradeTicketID])

    // Let the user know that we are creating a consolidated trade ticket
    useEffect(() => {
      if (selectedTrades.length > 1) {
        toast({
          title: 'Creating Consolidated Trade Ticket',
          variant: 'warning',
        })
      }
    }, [selectedTrades])

    async function handleFetchTrades() {
      try {
        if (!selectedTradeTicketID) return;
        const trades = await FetchTradeTicket(selectedTradeTicketID)
        setTrades(trades)
      } catch (error: any) {
        toast({
          title: 'Error fetching trades',
          description: error.message,
          variant: 'destructive',
        })
      }
    }

    async function handleGenerateTradeTicketConfirmationMessage() {
      if (!trades || !selectedTrades) return;
      setGeneratingMessage(true)
      try {
        const message = await GenerateTradeTicketConfirmationMessage(trades, selectedTrades)
        console.log(message)
        setClientMessage(message)
        setConfirmDialogOpen(true)
      } catch (error: any) {
        toast({
          title: 'Error generating trade ticket',
          description: error.message,
          variant: 'destructive',
        })
      } finally {
        setGeneratingMessage(false)
      }
    }

    async function handleSendToClient() {
      if (!clientMessage) return;
      setSending(true)
      try {
        let email = "lchavarria@acobo.com, arodriguez@acobo.com, rcontreras@acobo.com, pgonzalez@acobo.com"
        //let email = 'aa@agmtechnology.com'
        await SendToClient(clientMessage, email)
        toast({
          title: 'Trade ticket sent to client',
          description: 'The client will receive an email with the trade ticket shortly.',
          variant: 'success',
        })
        setConfirmDialogOpen(false)
      } catch (error: any) {
        toast({
          title: 'Error sending trade ticket',
          description: error.message,
          variant: 'destructive',
        })
      } finally {
        setSending(false)
      }
    }

  return (
    <DashboardPage title='Trade Tickets' description='Generate trade tickets for clients'>

      <div className='w-full h-full flex flex-col gap-5'>
        <Select onValueChange={(value) => setSelectedTradeTicketID(value)}>
          <SelectTrigger className="w-fit gap-2">
            <SelectValue placeholder={isLoadingTickets ? "Loading..." : "Select ticket"} />
          </SelectTrigger>
          <SelectContent>
            {tradeTickets.map((tradeTicket) => (
              <SelectItem 
                className='p-2' 
                key={tradeTicket.id} 
                value={tradeTicket.id}
              >
                {tradeTicket.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      <div className='w-full h-full flex flex-col gap-5 justify-start items-start'>
        {!trades ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Waiting for trade ticket to be generated...
          </div>
        ) : (
          <>
            <DataTable 
              data={trades}
              columns={columns}
              enableSelection 
              setSelection={setSelectedTrades} 
              infiniteScroll
              enableFiltering
            />
            <Button 
              disabled={selectedTrades.length === 0 || generatingMessage} 
              className='w-fit' 
              onClick={() => handleGenerateTradeTicketConfirmationMessage()}
            >
              {generatingMessage ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </div>
              ) : (
                'Generate Trade Ticket'
              )}
            </Button>
          </>
        )}
      </div>
      </div>
      
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review and Send Trade Ticket</DialogTitle>
            <DialogDescription>
              Please review the trade ticket before sending it to the client.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full max-h-[60vh] overflow-y-auto">
            <Textarea 
              value={clientMessage || ''} 
              readOnly 
              className="w-full text-md h-[55vh]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button 
              className={sending ? 'bg-green-500' : ''} 
              onClick={() => handleSendToClient()} 
              disabled={sending || !clientMessage}
            >
              {sending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </div>
              ) : (
                'Send to Client'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPage>
  )
}
