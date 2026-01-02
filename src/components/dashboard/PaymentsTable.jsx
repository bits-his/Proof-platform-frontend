import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
} from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/Card"
import { formatCurrency, formatDate } from "@/lib/utils"

const columns = [
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => <div className="font-mono text-xs text-neutral-500">{row.getValue("reference")}</div>,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => <div className="whitespace-nowrap text-sm font-medium">{formatDate(row.getValue("created_at"))}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      return <div className="text-right font-black text-neutral-900">{formatCurrency(amount)}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      let variant = "default";
      if (status === 'success') variant = "success";
      if (status === 'pending' || status === 'initiated') variant = "pending";
      if (status === 'failed') variant = "failed";

      return (
        <Badge variant={variant} className="capitalize font-bold">
          {status.toLowerCase()}
        </Badge>
      )
    },
  },
  {
    id: "receipt",
    header: "Proof",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const receiptId = row.original.receipt_id;

      if (status === 'success' && receiptId) {
        return (
          <a
            href={`/receipt/${receiptId}`}
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-bold text-xs uppercase tracking-widest"
          >
            Receipt
          </a>
        );
      }
      return <span className="text-neutral-300 text-xs">—</span>;
    }
  }
]

export function PaymentsTable({ data }) {
  const [sorting, setSorting] = React.useState([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  })

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Card key={row.id} className="overflow-hidden border-neutral-100 shadow-sm">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="font-mono text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      {row.getValue("reference")}
                    </div>
                    <div className="text-sm font-semibold text-neutral-600">
                      {formatDate(row.getValue("created_at"))}
                    </div>
                  </div>
                  {/* Reuse Status Cell Logic or duplicate for simplicity */}
                  <Badge
                    variant={row.getValue("status") === 'success' ? 'success' : row.getValue("status") === 'failed' ? 'failed' : 'pending'}
                    className="capitalize font-bold"
                  >
                    {row.getValue("status")}
                  </Badge>
                </div>

                <div className="flex justify-between items-end border-t border-neutral-50 pt-4 mt-2">
                  <div>
                    <div className="text-xs font-bold text-neutral-400 uppercase mb-0.5">Amount</div>
                    <div className="text-2xl font-black text-neutral-900 tracking-tight">
                      {formatCurrency(row.getValue("amount"))}
                    </div>
                  </div>

                  {row.original.receipt_id && row.getValue("status") === 'success' && (
                    <a
                      href={`/receipt/${row.original.receipt_id}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors"
                    >
                      View Proof
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-neutral-500">No payments found.</div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border bg-white overflow-hidden">
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 py-0 px-3"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:block">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 py-0 px-3"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
