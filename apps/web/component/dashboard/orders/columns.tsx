// components/dashboard/orders/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
// import { Order } from "@/types/order"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, Eye, Euro, Clock, CheckCircle2, Truck, XCircle, RefreshCcw, Building2, MapPin, Package, CreditCard, Banknote } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Order } from '@/types';

const statusConfig: Record<string, { className: string; icon: any }> = {
  pending: {
    className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20',
    icon: Clock,
  },
  confirmed: {
    className: 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20',
    icon: CheckCircle2,
  },
  processing: {
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20',
    icon: RefreshCcw,
  },
  shipped: {
    className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
    icon: Truck,
  },
  delivered: {
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20',
    icon: CheckCircle2,
  },
  cancelled: {
    className: 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20',
    icon: XCircle,
  },
  refunded: {
    className: 'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20',
    icon: RefreshCcw,
  },
};

const deliveryConfig: Record<string, { className: string; icon: any }> = {
  ekont: {
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
    icon: Package,
  },
  speedy: {
    className: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
    icon: Package,
  },
  delivery: {
    className: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20',
    icon: MapPin,
  },
  office: {
    className: 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20',
    icon: Building2,
  },
};

const paymentConfig: Record<string, { className: string; icon: any }> = {
  stripe: {
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
    icon: CreditCard,
  },
  bank: {
    className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
    icon: Building2,
  },
  cash: {
    className: 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20',
    icon: Banknote,
  },
};

export const columns: ColumnDef<Order>[] = [
  {
    // accessorKey: 'order_number',
    accessorFn: row => row.order_number,
    id: 'order_number',
    header: () => <div className="text-[1.6rem] font-[600] text-muted-foreground">Order No </div>,
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
    accessorFn: row => row.order_shipping?.full_name || 'Guest',
    id: 'customer',
    header: () => (
      <div className="text-[1.6rem] font-[600] text-muted-foreground">Customer</div>
    ),
    cell: ({ getValue }) => {
      const customer = getValue() as string;

      return <div className="text-[1.6rem]">{customer}</div>;
    },
  },
  {
    accessorFn: row => row.order_shipping?.email || 'N/A',
    id: 'email',
    header: () => <div className="text-[1.6rem] font-[600] text-muted-foreground">Email</div>,
    cell: ({ getValue }) => {
      const email = getValue() as string;

      return <div className="text-[1.6rem] text-muted-foreground">{email}</div>;
    },
  },
  {
    accessorFn: row => row.created_at,
    id: 'created_at',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center cursor-pointer text-[1.6rem] font-[600] text-muted-foreground hover:text-slate-200 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
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
    accessorFn: row => row.total_amount,
    id: 'total_amount',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center cursor-pointer text-[1.6rem] font-[600] text-muted-foreground hover:text-slate-200 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total_amount'));
      const formatted = amount.toFixed(2);

      return <div className="text-[1.6rem]">{formatted} €</div>;
    },
  },
  {
    accessorFn: row => row.delivery_company,
    id: 'delivery_company',
    header: () => <div className="text-[1.6rem] font-[600] text-muted-foreground">Company</div>,
    cell: ({ row }) => {
      const method = row.getValue('delivery_company') as string;
      const config = deliveryConfig[method] || { className: 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20', icon: Package };
      const Icon = config.icon;

      return (
        <Badge variant="outline" className={`rounded-full px-3 py-1 flex items-center w-fit gap-1.5 border ${config.className}`}>
          <Icon className="w-3.5 h-3.5" />
          <span className="capitalize">{method}</span>
        </Badge>
      );
    },
  },
  {
    accessorFn: row => row.delivery_method,
    id: 'delivery_method',
    header: () => <div className="text-[1.6rem] font-[600] text-muted-foreground">Delivery</div>,
    cell: ({ row }) => {
      const method = row.getValue('delivery_method') as string;
      const config = deliveryConfig[method] || { className: 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20', icon: Package };
      const Icon = config.icon;

      return (
        <Badge variant="outline" className={`rounded-full px-3 py-1 flex items-center w-fit gap-1.5 border ${config.className}`}>
          <Icon className="w-3.5 h-3.5" />
          <span className="capitalize">{method}</span>
        </Badge>
      );
    },
  },
  {
    accessorFn: row => row.status,
    id: 'status',
    header: () => <div className="text-[1.6rem] font-[600] text-muted-foreground">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const config = statusConfig[status] || { className: 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20', icon: Clock };
      const Icon = config.icon;

      return (
        <Badge variant="outline" className={`rounded-full px-3 py-1 flex items-center w-fit gap-1.5 border ${config.className}`}>
          <Icon className="w-3.5 h-3.5" />
          <span className="capitalize">{status}</span>
        </Badge>
      );
    },
  },
  {
    accessorFn: row => row.payment_method,
    id: 'payment_method',
    header: () => <div className="text-[1.6rem] font-[600] text-muted-foreground">Payment</div>,
    cell: ({ row }) => {
      const method = row.getValue('payment_method') as string;
      const config = paymentConfig[method] || { className: 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20', icon: Banknote };
      const Icon = config.icon;

      return (
        <Badge variant="outline" className={`rounded-full px-3 py-1 flex items-center w-fit gap-1.5 border ${config.className}`}>
          <Icon className="w-3.5 h-3.5" />
          <span className="capitalize">{method?.replace(/_/g, ' ')}</span>
        </Badge>
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
            <Button 
              variant="outline" 
              className="h-10 w-10 p-0 bg-[#20212b] border border-slate-700/50 text-slate-300 hover:bg-[#30313b] hover:text-white rounded-full flex items-center justify-center"
            >
              <span className="sr-only text-[1.6rem]">Open menu</span>
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel className="text-[1.6rem]">
              Actions
            </DropdownMenuLabel> */}
            <DropdownMenuItem
              className="text-[1.6rem]"
              onClick={() => navigator.clipboard.writeText(order.order_number)}>
              Copy No
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
