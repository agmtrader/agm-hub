'use client'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ReloadIcon } from "@radix-ui/react-icons"
import { accessAPI } from '@/utils/api'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Checkbox } from "@/components/ui/checkbox"

import { cn } from "@/lib/utils"
import { Map } from "@/lib/types"
import { ScrollArea } from '@/components/ui/scroll-area'

export default function TradeTickets() {

    const [ticketId, setTicketId] = useState<string | null>(null)

    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    const [ticket, setTicket] = useState<any[] | null>(null)
    const [indices, setIndices] = useState<number[] | null>(null)

    const [clientMessage, setClientMessage] = useState<string | null>(null)

    async function fetchTickets() {
      if (!ticketId) return;
      setGenerating(true)
      const response = await accessAPI('/flex_query/fetch', 'POST', {'queryIds': [ticketId]})
      setGenerating(false)
      setError(response['status'] === 'error' ? true : false)
      setTicket(response['content'][ticketId as string])
      setDialogOpen(true)
    }

    async function generateTradeTicket() {
      if (!indices) return;
      if (!ticket) return;

      if (indices.length == 0) return;
      let response = await accessAPI('/trade_tickets/generate_trade_ticket', 'POST', {'flex_query_dict': ticket, 'indices': indices.toString()})
      response = await accessAPI('/trade_tickets/generate_client_confirmation_message', 'POST', {'trade_data': response['content']})
      setClientMessage(response['content']['message'])
      setDialogOpen(false)
    }

    async function sendToClient() {
      if (!clientMessage) return;

      const clientEmails = "lchavarria@acobo.com,arodriguez@acobo.com, rcontreras@acobo.com"
      const response = await accessAPI('/email/send_client_email', 'POST', {'data': clientMessage, 'client_email': clientEmails, 'subject': 'Confirmación de Transacción'})
      console.log(response)
    }

    const ticketIds = [
      {
        name: 'ACOBO',
        id: '986431'
      }
    ]

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-y-10 my-10 w-full justify-center items-center">

        <h1 className="text-7xl text-foreground font-bold">Generate Trade Tickets</h1>

        <Card>
          <CardHeader>
            <CardTitle>Select Ticket ID</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        
        {clientMessage &&
          <Card>
            <CardHeader>
              <CardTitle>Generated Trade Ticket</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-y-5 justify-center items-center'>
                <Textarea 
                  value={clientMessage} 
                  readOnly 
                  placeholder="Generated report will appear here..."
                  className="min-h-64 min-w-96"
                />
                <Button className='w-fit' onClick={() => setConfirmDialogOpen(true)}>Send to Client</Button>
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
            </CardContent>
          </Card>
        }

        {!clientMessage && ticketId &&
          <Button onClick={fetchTickets} disabled={generating}>
            {!ticket && generating ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Flex Query'
            )}
          </Button>
        }
      </div>
      
      {error && (
        <Alert variant="destructive" className="">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-2/3 h-2/3 flex justify-evenly items-center flex-col max-w-7xl">
          <DialogHeader>
              <DialogTitle className='text-5xl font-bold'>Generated Flex Query</DialogTitle>
              <DialogDescription>Please select one or more tickets to generate trade tickets for.</DialogDescription>
          </DialogHeader>
          <ScrollArea className='w-full h-full flex justify-center items-center'>
            {ticket &&<DataTableSelect data={ticket} setSelection={setIndices} width={100}/>}
          </ScrollArea>
          <Button onClick={generateTradeTicket}>
            Generate Trade Ticket
          </Button>
        </DialogContent>
      </Dialog>

    </div>
  )
}

interface DataTableSelectProps<TData> {
    data: TData[]
    setSelection: React.Dispatch<React.SetStateAction<number[] | null>>
    width?: number
    dark?: boolean
}

const DataTableSelect = <TData,>({data, setSelection, width, dark}: DataTableSelectProps<TData>) => {

  if (data.length == 0) {
    return (
      <div></div>
    )
  }
  
  
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])

  function buildColumns(data:Map) {
      const columns:Array<any> = []

      columns.push(
          {
              id: "select",
              cell: ({ row }:{row: any}) => (
                <Checkbox
                  className={cn(dark && "bg-background text-foreground")}
                  checked={row.getIsSelected()}
                  onCheckedChange={(value:any) => selectRow(row, !!value)}
                  aria-label="Select row"
                />
              ),
              enableSorting: false,
              enableHiding: false,
            }
      )

      const keysToInclude = ['Symbol', 'Description', 'Quantity', 'Price', 'Value'];
      Object.keys(data[0]).forEach((column) => {
        if (keysToInclude.includes(column)) {
          columns.push({
            accessorKey: column,
            header: column.charAt(0).toUpperCase() + column.slice(1)
          });
        }
      });

      return columns

  }  
  const columns = buildColumns(data as Map)

  const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        rowSelection
      },
      initialState: {
        pagination: {
          pageSize: 30
        }
      }
  })

  function selectRow (row:any, value: any) {
    row.toggleSelected(value)
  }

  useEffect(() => {
    setSelection(table.getFilteredSelectedRowModel().rows.map((row) => row.index))
  }, [table.getFilteredSelectedRowModel().rows])
  
  return (
    <div className={cn('w-[50%] rounded-md border', width && `w-[${width}%]`)}>
      <Table>
        <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                return (
                    <TableHead className={dark ? "text-foreground":''} key={header.id}>
                    {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                    </TableHead>
                )
                })}
            </TableRow>
            ))}
        </TableHeader>
        <TableBody>
            {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
                <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                >
                {row.getVisibleCells().map((cell) => (
                    <TableCell className={dark ? "text-foreground":''} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
                </TableRow>
            ))
            ) : (
            <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
                </TableCell>
            </TableRow>
            )}
        </TableBody>
      </Table>
    </div>
  )
}
