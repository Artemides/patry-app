"use client";

import * as React from "react";
import { useEffect, useMemo } from "react";
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Minus, MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";

import { useFormState } from "react-dom";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/Button";
import { deleteItemAction } from "../_actions/deleteItem.action";
import { ToogleItemAction } from "../_actions/toggleItem.action";
import { updateStockAction } from "../_actions/updateStock.action";
import { Input } from "@/components/Input";

export type Item = {
  id: number;
  name: string;
  quantity: number;
  isLow: boolean;
};

export function ItemsTable({ items }: { items: Item[] }) {
  const { toast } = useToast();

  const [toggleState, onToogleItemAction] = useFormState(ToogleItemAction, {
    status: "default",
  });

  const [updateState, onUpdateStockAction] = useFormState(updateStockAction, {
    status: "default",
  });

  const [deleteState, deleteAction] = useFormState(deleteItemAction, {
    status: "default",
  });

  useEffect(() => {
    if (toggleState.status === "success")
      toast({
        title: "Toogle Item Status",
        description: "This item was unmarked as ...",
      });
  }, [toast, toggleState]);

  useEffect(() => {
    if (deleteState.status === "success")
      toast({
        title: "Item Removed",
        description: "This item was removed from your pantry",
      });
  }, [toast, deleteState]);

  useEffect(() => {
    if (updateState.status === "success")
      toast({
        title: "Item Updated",
        description: "We moved your item to the out of tab",
      });
  }, [toast, updateState]);

  const columns: ColumnDef<Item>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => {
          return (
            <form className="flex gap-2 items-center">
              <input type="hidden" name="itemId" value={row.original.id} />
              <Input
                id="quantity"
                type="number"
                name="quantity"
                defaultValue={row.original.quantity}
                className="max-w-16"
              />

              <Button
                variant="ghost"
                className="disabled:text-gray-600"
                disabled={row.original.quantity === 0}
                formAction={onUpdateStockAction}
              >
                Save
              </Button>
            </form>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
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
                <DropdownMenuItem>
                  <form action={onToogleItemAction}>
                    <input
                      type="hidden"
                      value={row.original.id}
                      name="itemId"
                    />

                    <button>
                      {row.original.isLow ? "Unmark as Low" : "Mark as Low"}
                    </button>
                  </form>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form action={deleteAction}>
                    <input
                      type="hidden"
                      value={row.original.id}
                      name="itemId"
                    />
                    <button className="text-red-500 hover:text-red-400">
                      Remove
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [deleteAction, onToogleItemAction, onUpdateStockAction]
  );

  const table = useReactTable({
    data: items,
    columns,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: [{ id: "name", desc: false }],
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
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
                  );
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
