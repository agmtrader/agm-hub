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
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table"

import { MoreHorizontal } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils"
import { Map } from "@/lib/types"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

interface RowAction {
  label: string;
  onClick: (row: any) => void;
}

export interface ColumnDefinition<TData> {
  accessorKey: keyof TData;
  header: string;
  cell?: (info: { getValue: () => any }) => React.ReactNode;
}

interface DataTableProps<TData> {
  data: TData[]
  columns?: ColumnDefinition<TData>[]
  setSelection?: (selectedData: TData[]) => void
  enableSelection?: boolean
  enablePagination?: boolean
  enableRowActions?: boolean
  rowActions?: RowAction[]
  selection?: TData[]
}

export const DataTable = <TData,>({
  data,
  columns: providedColumns,
  setSelection,
  enableSelection = false,
  enablePagination = false,
  enableRowActions = false,
  selection,
  rowActions,
}: DataTableProps<TData>) => {
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isPageTransition, setIsPageTransition] = useState(false)

  if (data.length === 0) {
    return <div></div>
  }

  const buildColumns = (data: Map, providedColumns?: ColumnDefinition<TData>[], rowActions?: RowAction[]) => {
    const columns: ColumnDef<Map>[] = []

    if (enableSelection) {
      columns.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      })
    }

    const createObjectCell = (getValue: () => any) => {
      const value = getValue()
      if (typeof value === 'object' && value !== null) {
        return (
          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger asChild className="w-full flex justify-center">
                <Button size="icon" className="h-6 w-6 p-0 bg-transparent hover:bg-transparent">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="sr-only">View object details</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <pre className="max-w-xs overflow-auto text-xs">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
      return value
    }

    if (providedColumns) {
      columns.push(...providedColumns.map(col => ({
        accessorKey: col.accessorKey,
        header: col.header,
        cell: col.cell || (({ getValue }) => createObjectCell(getValue)),
      })))
    } else if (data.length > 0) {
      Object.keys(data[0]).forEach((column) => {
        columns.push({
          accessorKey: column,
          header: column,
          cell: ({ getValue }) => createObjectCell(getValue),
        })
      })
    }

    if (enableRowActions && rowActions) {
      columns.push({
        id: "actions",
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {rowActions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => action.onClick(row.original)}
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      })
    }

    return columns
  }

  const columns = buildColumns(data as Map, providedColumns, rowActions)

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<TData, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      setIsPageTransition(true)
      setPagination(updater)
    },
    state: {
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility,
      pagination,
    },
    initialState: { //This line
      pagination: {
          pageSize: 20,
      },
    }
  })

  useEffect(() => {
    if (enableSelection && setSelection) {
      const selectedRows = table.getFilteredSelectedRowModel().rows
      console.log(selectedRows)
      setSelection(selectedRows.map((row) => row.original as TData))
    }
  }, [rowSelection, enableSelection, setSelection, table])

  useEffect(() => {
    if (isPageTransition) {
      setIsPageTransition(false)
    }
  }, [pagination.pageIndex])

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeInOut",
      },
    }),
    hover: { scale: 1.00, transition: { duration: 0.2 } },
  }

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  return (
    <div className="w-full rounded-md text-foreground relative border p-5">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="wait">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  variants={rowVariants}
                  initial={isPageTransition ? "visible" : "hidden"}
                  animate="visible"
                  exit="hidden"
                  custom={index}
                  whileHover="hover"
                  className="hover:bg-muted cursor-pointer"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
      {enablePagination && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex gap-2">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
            </motion.div>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
