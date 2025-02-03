"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Movement } from "@/types/movement";
import { MovementsTableProps } from "@/types/components";

const columns: ColumnDef<Movement>[] = [
  {
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Usuario
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Monto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.abs(amount));

      return (
        <div
          className={`font-medium  ${
            amount >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = Number(row.getValue("date"));
      const date = new Date(timestamp);
      const formatted = new Intl.DateTimeFormat("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
      return <div>{formatted}</div>;
    },
  },
];

export function MovementsTable({
  data,
  role,
  onAddMovement,
}: MovementsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const totalBalance = data.reduce((sum, mov) => sum + mov.amount, 0);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        {role === "Admin" && (
          <Button
            onClick={onAddMovement}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-400"
          >
            Nuevo Movimiento
          </Button>
        )}
      </div>
      <div className="flex items-center py-4"></div>
      <div className="rounded-md border">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-lg font-bold">
          Balance Total:{" "}
          <span
            className={totalBalance >= 0 ? "text-green-600" : "text-red-600"}
          >
            {new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(totalBalance)}
          </span>
        </div>
        {
          <div className="space-x-2 text-white">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-gray-600 text-gray-900 hover:bg-gray-800 hover:text-gray-100 disabled:opacity-50 disabled:text-gray-500"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-gray-600 text-gray-900 hover:bg-gray-800 hover:text-gray-100 disabled:opacity-50 disabled:text-gray-500"
            >
              Siguiente
            </Button>
          </div>
        }
      </div>
    </div>
  );
}
