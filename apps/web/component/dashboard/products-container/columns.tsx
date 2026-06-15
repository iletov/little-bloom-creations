// components/dashboard/products/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, ExternalLink, CheckCircle2, XCircle, Package, MoreHorizontal, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { StockBadge, ActiveStatusBadge } from '@/component/dashboard/badges/ProductBadges';

interface Product {
  id: string;
  name?: string;
  sku: string;
  sanityId: string;
  price: number;
  currentStock: number;
  isActive: boolean;
  variants?: Array<{
    variant_sku: string;
    variant_name: string;
    price: number;
    currentStock: number;
    isActive: boolean;
  }>;
}

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorFn: row => row.sku,
    id: 'sku',
    header: () => <div className="text-[1.6rem] font-[600] text-muted-foreground">SKU</div>,
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="space-y-2">
          <div className="font-mono text-2xl font-medium">{product.sku}</div>

          {/* Show variants if any */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-1.5 pl-4 border-l-[1px] border-gray-500">
              {product.variants.map(variant => (
                <div
                  key={variant.variant_sku}
                  className="text-xl text-gray-300">
                  └─ {variant.variant_sku}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: 'name',
    header: () => <div className="text-[1.6rem] font-[600] text-muted-foreground">Product</div>,
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="space-y-2">
          <div className="font-medium text-2xl">
            {product.name || `Product #${product.sku}`}
          </div>

          {/* Show variant names */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-1.5 pl-4 border-l-[1px] border-gray-500">
              {product.variants.map(variant => (
                <div
                  key={variant.variant_sku}
                  className="text-xl text-gray-300">
                  └─ {variant.variant_name}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center cursor-pointer text-[1.6rem] font-[600] text-muted-foreground hover:text-slate-200 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="space-y-2">
          <div className="font-medium text-2xl">
            {Number(product.price).toFixed(2)} €
          </div>

          {/* Show variant prices */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-1.5 pl-4 border-l-[1px] border-gray-500">
              {product.variants.map(variant => (
                <div
                  key={variant.variant_sku}
                  className="text-xl text-gray-300">
                  └─ {Number(variant.price).toFixed(2)} €
                </div>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'currentStock',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center cursor-pointer text-[1.6rem] font-[600] text-muted-foreground hover:text-slate-200 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="space-y-2">
          <StockBadge stock={product.currentStock} />

          {/* Show variant stock */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-1.5 pl-4 border-l-[1px] border-gray-500">
              {product.variants.map(variant => (
                <div key={variant.variant_sku}>
                  <StockBadge stock={variant.currentStock} />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: () => <div className="text-[1.6rem] font-[600] text-muted-foreground">Status</div>,
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;

      return <ActiveStatusBadge isActive={isActive} className="px-3 py-1" />;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;

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
          <DropdownMenuContent align="end" className="bg-[#20212b] border-slate-700 text-slate-200">
            <DropdownMenuItem asChild className="text-[1.4rem] cursor-pointer hover:bg-[#30313b] focus:bg-[#30313b] focus:text-white">
              <Link href={`/dashboard/products/${product.sku}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem asChild className="text-[1.4rem] cursor-pointer hover:bg-[#30313b] focus:bg-[#30313b] focus:text-white">
              <Link
                href={`/studio/intent/edit/id=${product.sanityId};type=productType`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit in Sanity
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
