// components/dashboard/products/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  sku: string;
  sanity_id: string;
  price: number;
  current_stock: number;
  is_active: boolean;
  variants?: Array<{
    variant_sku: string;
    variant_name: string;
    price: number;
    current_stock: number;
    is_active: boolean;
  }>;
}

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="space-y-1">
          <div className="font-mono text-sm font-medium">{product.sku}</div>

          {/* Show variants if any */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-0.5 pl-4 border-l-2 border-gray-200">
              {product.variants.map(variant => (
                <div
                  key={variant.variant_sku}
                  className="text-xs text-gray-500 font-mono">
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
    header: 'Product',
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="space-y-1">
          <div className="font-medium">Product #{product.sku}</div>

          {/* Show variant names */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-0.5 pl-4 border-l-2 border-gray-200">
              {product.variants.map(variant => (
                <div
                  key={variant.variant_sku}
                  className="text-xs text-gray-500">
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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="space-y-1">
          <div className="font-medium">{product.price.toFixed(2)} BGN</div>

          {/* Show variant prices */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-0.5 pl-4 border-l-2 border-gray-200">
              {product.variants.map(variant => (
                <div
                  key={variant.variant_sku}
                  className="text-xs text-gray-500">
                  └─ {variant.price.toFixed(2)} BGN
                </div>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'current_stock',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="space-y-1">
          <StockBadge stock={product.current_stock} />

          {/* Show variant stock */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-0.5 pl-4 border-l-2 border-gray-200">
              {product.variants.map(variant => (
                <div key={variant.variant_sku}>
                  <StockBadge stock={variant.current_stock} small />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;

      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center gap-2">
          {/* Edit Stock */}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/products/${product.sku}/stock`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit Stock
            </Link>
          </Button>

          {/* View in Sanity */}
          {/* <Button variant="ghost" size="sm" asChild>
            <Link
              href={`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio/desk/product;${product.sanity_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button> */}
        </div>
      );
    },
  },
];

// Helper component for stock badge
function StockBadge({ stock, small }: { stock: number; small?: boolean }) {
  const getColor = () => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock <= 5) return 'bg-yellow-100 text-yellow-800';
    if (stock <= 20) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <Badge className={`${getColor()} ${small ? 'text-xs' : ''}`}>
      {stock} units
    </Badge>
  );
}
