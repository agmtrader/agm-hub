"use client"
import { useEffect, useState, useCallback, useRef, useMemo } from "react"

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
  CellContext,
} from "@tanstack/react-table"

import { ArrowDown, ArrowUp, ArrowUpDown, Download, MoreHorizontal } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Map } from "@/lib/public/types"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { itemVariants } from "@/lib/anims"
import { Input } from "@/components/ui/input"

interface RowAction {
  label: string;
  onClick: (row: any) => void;
}

export interface ColumnDefinition<TData> {
  accessorKey: keyof TData;
  header: string;
  cell?: (info: { getValue: () => any }) => React.ReactNode;
  enableSorting?: boolean;
  sortValue?: (row: TData) => unknown;
}

interface DataTableProps<TData> {
  data: TData[]
  columns?: ColumnDefinition<TData>[]
  enableSelection?: boolean
  setSelection?: (selectedData: TData[]) => void
  enablePagination?: boolean
  pageSize?: number
  enableRowActions?: boolean
  rowActions?: RowAction[]
  enableFiltering?: boolean
  infiniteScroll?: boolean
  enableSorting?: boolean
  reporting?: boolean
  enableCsvExport?: boolean
  csvFileName?: string
}

export const DataTable = <TData,>({
  data,
  columns: providedColumns,
  setSelection,
  enableSelection = false,
  enablePagination = false,
  pageSize = 10,
  enableRowActions = false,
  rowActions,
  enableFiltering = false,
  infiniteScroll = false,
  enableSorting = false,
  reporting = false,
  enableCsvExport = false,
  csvFileName = "table-export.csv",
}: DataTableProps<TData>) => {
  const observerTarget = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [virtualPageSize, setVirtualPageSize] = useState(pageSize)

  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: infiniteScroll ? data.length : pageSize,
  })
  const [isPageTransition, setIsPageTransition] = useState(false)

  const buildColumns = (data: Map, providedColumns?: ColumnDefinition<TData>[], rowActions?: RowAction[]) => {
    const columns: ColumnDef<Map>[] = []

    if (!data || !Array.isArray(data) || data.length === 0) {
      return columns
    }

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

    const createObjectCell = (getValue: () => any, row: any, column: any) => {
      
      const value = getValue()

      if (typeof value === 'boolean') {
        return (
          <Checkbox checked={value} />
        )
      }

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
      columns.push(...providedColumns.map((col) => {
        const cell = col.cell || ((context: CellContext<Map, any>) => createObjectCell(context.getValue, context.row, context.column))
        const baseColumn = {
          header: col.header,
          cell,
          enableSorting: enableSorting && (col.enableSorting ?? true),
        }

        if (col.sortValue) {
          return {
            ...baseColumn,
            id: String(col.accessorKey),
            accessorFn: (row: Map) => col.sortValue?.(row as TData),
          } as ColumnDef<Map>
        }

        return {
          ...baseColumn,
          accessorKey: col.accessorKey,
        } as ColumnDef<Map>
      }))
    } else if (data.length > 0 && typeof data[0] === 'object') {
      Object.keys(data[0]).forEach((column) => {
        columns.push({
          accessorKey: column,
          header: column,
          cell: (context: CellContext<Map, any>) => createObjectCell(context.getValue, context.row, context.column),
          enableSorting,
        })
      })
    }

    if (enableRowActions && rowActions) {
      const actionsColumn: ColumnDef<Map> = {
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
      }

      // Keep actions on the left side. If selection exists, keep selection first.
      const actionsInsertIndex = enableSelection ? 1 : 0
      columns.splice(actionsInsertIndex, 0, actionsColumn)
    }

    return columns
  }

  const columns = useMemo(
    () => buildColumns(data as Map, providedColumns, rowActions),
    [data, providedColumns, rowActions, enableSelection, enableRowActions, enableSorting]
  )

  const handlePaginationChange = useCallback(
    (
      updater:
        | { pageIndex: number; pageSize: number }
        | ((old: { pageIndex: number; pageSize: number }) => { pageIndex: number; pageSize: number })
    ) => {
      setPagination((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater

        if (prev.pageIndex === next.pageIndex && prev.pageSize === next.pageSize) {
          return prev
        }

        setIsPageTransition(true)
        return next
      })
    },
    []
  )

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<TData, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: infiniteScroll ? undefined : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: infiniteScroll ? undefined : handlePaginationChange,
    state: {
      sorting,
      rowSelection,
      globalFilter,
      columnVisibility,
      ...(infiniteScroll ? {} : { pagination }),
    },
    initialState: {
      pagination: {
        pageSize: infiniteScroll ? data.length : pageSize,
      },
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (value === null || value === undefined) return false
      return String(value)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase())
    },
    enableSorting,
  })

  useEffect(() => {
    if (!infiniteScroll) return

    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVirtualPageSize(prev => Math.min(prev + pageSize, data.length))
        }
      },
      {
        root: scrollContainer,
        threshold: 0.1,
      }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [infiniteScroll, pageSize, data.length])

  useEffect(() => {
    if (!infiniteScroll || virtualPageSize >= data.length) return

    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    // If reporting rows are compact and the container still can't scroll,
    // keep loading chunks until it can scroll (or all rows are visible).
    if (scrollContainer.scrollHeight <= scrollContainer.clientHeight) {
      setVirtualPageSize((prev) => Math.min(prev + pageSize, data.length))
    }
  }, [infiniteScroll, virtualPageSize, pageSize, data.length])

  useEffect(() => {
    if (enableSelection && setSelection) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
      setSelection(selectedRows as TData[])
    }
  }, [rowSelection, enableSelection, setSelection, table])

  useEffect(() => {
    if (isPageTransition) {
      setIsPageTransition(false)
    }
  }, [pagination.pageIndex])

  const getVisibleRows = useCallback(() => {
    if (!infiniteScroll) return table.getRowModel().rows

    return table
      .getRowModel()
      .rows
      .slice(0, virtualPageSize)
  }, [infiniteScroll, table, virtualPageSize])

  const escapeCsvValue = (value: unknown): string => {
    if (value === null || value === undefined) return ""
    const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value)
    if (/[",\n\r]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }

  const getCsvHeaders = (): string[] => {
    if (providedColumns && providedColumns.length > 0) {
      return providedColumns.map((col) => col.header)
    }

    if (!data || data.length === 0 || typeof data[0] !== "object" || data[0] === null) {
      return []
    }

    return Object.keys(data[0] as object)
  }

  const getCsvRowValue = (row: TData, column: ColumnDefinition<TData>): unknown => {
    const key = column.accessorKey as string
    return (row as Record<string, unknown>)[key]
  }

  const downloadCsv = () => {
    const headers = getCsvHeaders()
    if (headers.length === 0) return

    const rows = table.getPrePaginationRowModel().rows.map((row) => row.original)

    const csvRows: string[] = [headers.map(escapeCsvValue).join(",")]

    if (providedColumns && providedColumns.length > 0) {
      rows.forEach((row) => {
        const values = providedColumns.map((column) => escapeCsvValue(getCsvRowValue(row as TData, column)))
        csvRows.push(values.join(","))
      })
    } else {
      rows.forEach((row) => {
        const values = headers.map((header) => escapeCsvValue((row as Record<string, unknown>)[header]))
        csvRows.push(values.join(","))
      })
    }

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = csvFileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!data || data.length === 0) {
    return (
      <div className={`w-full rounded-md text-foreground relative border ${reporting ? "p-3 text-xs" : "p-5"}`}>
        <div className="flex justify-center items-center h-24">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full min-w-0 max-w-full overflow-hidden rounded-md text-foreground relative border ${reporting ? "p-2 sm:p-3 text-xs" : "p-3 sm:p-5"}`}>
        <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center items-start ${reporting ? "gap-2 py-2" : "gap-4 py-4"}`}>
          {enableFiltering && (
            <Input
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className={`w-full sm:max-w-sm ${reporting ? "h-8 text-xs" : ""}`}
            />
          )}
          <div className="flex items-center gap-3">
            {enableCsvExport && (
              <Button variant="outline" size="sm" onClick={downloadCsv}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            )}
            {data.length > 0 && (
              <span className={`text-foreground ${reporting ? "text-[11px]" : "text-xs"}`}>
                {data.length} row(s)
              </span>
            )}
          </div>
        </div>

      <div
        ref={scrollContainerRef}
        className={`w-full min-w-0 max-w-full overflow-x-auto ${infiniteScroll ? "max-h-[600px] overflow-y-auto" : ""} ${reporting ? "border border-border rounded-sm" : ""}`}
      >
        <Table className={reporting ? "text-[11px]" : ""}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className={reporting ? "bg-muted/40 border-b border-border" : ""}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`${reporting ? "px-2 py-1.5 text-[11px] font-semibold border-r border-border last:border-r-0 whitespace-nowrap overflow-hidden text-ellipsis text-right" : "whitespace-normal break-words sm:whitespace-nowrap"}`}
                  >
                    {header.isPlaceholder ? null : (() => {
                      const canSort = enableSorting && header.column.getCanSort()
                      const sortedState = header.column.getIsSorted()

                      if (!canSort) {
                        const headerContent = flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                        return reporting ? <div className="w-full text-right">{headerContent}</div> : headerContent
                      }

                      return (
                        <button
                          type="button"
                          className={`inline-flex items-center select-none ${reporting ? "w-full justify-end gap-0.5" : "gap-1"}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sortedState === "asc" ? (
                            <ArrowUp className={reporting ? "h-3 w-3" : "h-3.5 w-3.5"} />
                          ) : sortedState === "desc" ? (
                            <ArrowDown className={reporting ? "h-3 w-3" : "h-3.5 w-3.5"} />
                          ) : (
                            <ArrowUpDown className={`${reporting ? "h-3 w-3" : "h-3.5 w-3.5"} opacity-60`} />
                          )}
                        </button>
                      )
                    })()}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="sync">
              {getVisibleRows()?.length ? (
                getVisibleRows().map((row, index) => (
                  <motion.tr
                    key={row.id}
                    variants={itemVariants}
                    initial={isPageTransition ? "visible" : "hidden"}
                    animate="visible"
                    exit="hidden"
                    custom={index}
                    whileHover="hover"
                    className={`${reporting ? "hover:bg-muted/40" : "hover:bg-muted cursor-pointer"}`}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`select-all ${reporting ? "px-2 py-1 border-r border-b border-border last:border-r-0 text-[11px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[16rem] sm:max-w-[22rem] text-right" : "whitespace-normal break-words max-w-[16rem] sm:max-w-[22rem]"}`}
                      >
                        {reporting ? (
                          <div className="w-full flex justify-end">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className={`h-24 text-center ${reporting ? "text-[11px]" : ""}`}>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
        {infiniteScroll && virtualPageSize < data.length && (
          <div 
            ref={observerTarget} 
            className="h-10 w-full flex items-center justify-center"
          >
            <div className="text-sm text-muted-foreground">Loading more...</div>
          </div>
        )}
      </div>
      {enablePagination && !infiniteScroll && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">


            {enableSelection ? (
              <span>
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </span>
            ) : (
              <span>
                {table.getFilteredRowModel().rows.length} rows
              </span>
            )}
            

          </div>
          <div className="flex gap-2">
            <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
            </motion.div>
            <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
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
