"use client"
import { useEffect, useState } from "react"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnDef,
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

interface DataTableSelectProps<TData> {
    data: TData[]
    setSelection: React.Dispatch<React.SetStateAction<TData | null>>
    width?: number
}

interface DataTableProps<TData> {
  data: TData[]
  width?: number
}

export const DataTable = <TData,>({data, width}: DataTableProps<TData>) => {

    const [rowSelection, setRowSelection] = useState({})
    const [sorting, setSorting] = useState<SortingState>([])

    function buildColumns(data:Map) {
        const columns:Array<any> = []
  
        Object.keys(data[0]).forEach((column) => {
          columns.push({
            accessorKey:column, 
            header:column
          })
        })
  
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
        state: {
          sorting,
        },
    })

    return (
    <div className={cn('w-[50%] rounded-md border', width && `w-[${width}%]`)}>
        <Table>
        <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                return (
                    <TableHead key={header.id} className="text-white">
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
                    <TableCell key={cell.id}>
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

export const DataTableSelect = <TData,>({data, setSelection, width}: DataTableSelectProps<TData>) => {

    const [rowSelection, setRowSelection] = useState({})
    const [sorting, setSorting] = useState<SortingState>([])

    function buildColumns(data:Map) {
        const columns:Array<any> = []

        columns.push(
            {
                id: "select",
                cell: ({ row }:{row: any}) => (
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value:any) => selectRow(row, !!value)}
                    aria-label="Select row"
                  />
                ),
                enableSorting: false,
                enableHiding: false,
              }
        )
  
        Object.keys(data[0]).forEach((column) => {
          columns.push({
            accessorKey:column, 
            header:column
          })
        })
  
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
        enableMultiRowSelection:false,
        state: {
          sorting,
          rowSelection
        },
    })

    function selectRow (row:any, value: any) {
      row.toggleSelected(value)
    }

    useEffect(() => {
      if (table.getFilteredSelectedRowModel().rows[0]) {
        setSelection(table.getFilteredSelectedRowModel().rows[0].original)
      } else {
        setSelection(null)
      }
    })

    return (
      <div className={cn('w-[50%] rounded-md border', width && `w-[${width}%]`)}>
        <Table>
          <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                  return (
                      <TableHead key={header.id}>
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
                      <TableCell key={cell.id}>
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