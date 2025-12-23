// components/dashboard/orders/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
// import { Order } from "@/types/order"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, Eye, Euro } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Order } from '@/types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-800/40 text-yellow-300 hover:bg-yellow-800/40',
  confirmed: 'bg-green-800/40 text-green-300 hover:bg-green-800/40',
  processing: 'bg-blue-800/40 text-blue-300 hover:bg-blue-800/40',
  shipped: 'bg-purple-800/40 text-purple-300 hover:bg-purple-800/40',
  delivered: 'bg-gray-800/40 text-gray-300 hover:bg-gray-800/40',
  cancelled: 'bg-red-800/40 text-red-300 hover:bg-red-800/40',
  refunded: 'bg-orange-800/40 text-orange-300 hover:bg-orange-800/40',
};

const deliveryMethodColors: Record<string, string> = {
  ekont: 'bg-blue-800/40 text-blue-300 hover:bg-blue-800/40',
  speedy: 'bg-red-800/40 text-red-300 hover:bg-red-800/40',
  delivery: 'bg-yellow-800/40 text-orange-300 hover:bg-yellow-800/40',
  office: 'bg-violet-800/40 text-violet-300 hover:bg-violet-800/40',
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'order_number',
    header: () => <div className="text-[1.6rem] font-[600]">Order No </div>,
    cell: ({ row }) => {
      const id = row.getValue('order_number') as string;
      return (
        <div className="font-mono text-[1.6rem] text-muted-foreground">
          {id.slice(0, 6)}...
        </div>
      );
    },
  },
  {
    accessorKey: 'full_name',
    header: () => (
      <div className="text-[1.6rem] text- font-[600]">Customer</div>
    ),
    cell: ({ row }) => {
      const customer = row.getValue('full_name') as Order['full_name'];

      return <div className="text-[1.6rem]">{customer}</div>;
    },
  },
  {
    accessorKey: 'email',
    header: () => <div className="text-[1.6rem] font-[600]">Email</div>,
    cell: ({ row }) => {
      const email = row.getValue('email') as Order['email'];

      return <div className="text-[1.6rem] text-muted-foreground">{email}</div>;
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          className="bg-[#404040] text-[1.6rem] text-foreground"
          size="lg"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return (
        <div className="text-[1.6rem]">
          {date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </div>
      );
    },
  },
  {
    accessorKey: 'subtotal',
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          className="bg-[#404040] text-[1.6rem] text-foreground"
          size="lg"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Total
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('subtotal'));
      const formatted = amount.toFixed(2);

      return <div className="text-[1.6rem]">{formatted} €</div>;
    },
  },
  {
    accessorKey: 'delivery_company',
    header: () => <div className="text-[1.6rem] font-[600]">Company</div>,
    cell: ({ row }) => {
      const method = row.getValue('delivery_company') as string;

      return <Badge className={deliveryMethodColors[method]}>{method}</Badge>;
    },
  },
  {
    accessorKey: 'delivery_method',
    header: () => <div className="text-[1.6rem] font-[600]">Delivery</div>,
    cell: ({ row }) => {
      const method = row.getValue('delivery_method') as string;

      return <Badge className={deliveryMethodColors[method]}>{method}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: () => <div className="text-[1.6rem] font-[600]">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      return <Badge className={statusColors[status]}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'payment_method',
    header: () => <div className="text-[1.6rem] font-[600]">Payment</div>,
    cell: ({ row }) => {
      const method = row.getValue('payment_method') as string;
      return (
        <div className="text-[1.6rem] capitalize">
          {method?.replace(/_/g, ' ')}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only text-[1.6rem]">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-[1.6rem]">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="text-[1.6rem]"
              onClick={() => navigator.clipboard.writeText(order.order_number)}>
              Copy order Num
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-[1.6rem]">
              <Link href={`/dashboard/orders/${order.order_number}`}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
