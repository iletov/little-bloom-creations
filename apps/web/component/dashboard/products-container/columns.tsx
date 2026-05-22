// components/dashboard/products/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name?: string;
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
    accessorFn: row => row.sku,
    id: 'sku',
    header: () => <div className="text-[1.6rem] font-[600]">'SKU'</div>,
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
    header: () => <div className="text-[1.6rem] font-[600]">'Product'</div>,
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
        <Button
          variant="outline"
          className="bg-[#404040] text-[1.6rem] text-foreground"
          size="lg"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Price
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="space-y-2">
          <div className="font-medium text-2xl">
            {product.price.toFixed(2)} BGN
          </div>

          {/* Show variant prices */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-1.5 pl-4 border-l-[1px] border-gray-500">
              {product.variants.map(variant => (
                <div
                  key={variant.variant_sku}
                  className="text-xl text-gray-300">
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
          variant="outline"
          className="bg-[#404040] text-[1.6rem] text-foreground"
          size="lg"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Stock
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="space-y-2">
          <StockBadge stock={product.current_stock} />

          {/* Show variant stock */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-1.5 pl-4 border-l-[1px] border-gray-500">
              {product.variants.map(variant => (
                <div key={variant.variant_sku}>
                  <StockBadge stock={variant.current_stock} />
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
    header: () => <div className="text-[1.6rem] font-[600]">'Status'</div>,
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;

      return (
        <Badge variant={isActive ? 'active' : 'inactive'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => {
  //     const product = row.original;

  //     return (
  //       <div className="flex items-center gap-2">
  //         {/* Edit Stock */}
  //         <Button variant="outline" size="lg" asChild>
  //           <Link href={`/dashboard/products/${product.sku}/stock`}>
  //             <Edit className="h-4 w-4 mr-1" />
  //             Edit Stock
  //           </Link>
  //         </Button>

  //         {/* View in Sanity */}
  //         {/* <Button variant="ghost" size="sm" asChild>
  //           <Link
  //             href={`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio/desk/product;${product.sanity_id}`}
  //             target="_blank"
  //             rel="noopener noreferrer"
  //           >
  //             <ExternalLink className="h-4 w-4" />
  //           </Link>
  //         </Button> */}
  //       </div>
  //     );
  //   },
  // },
];

// Helper component for stock badge
function StockBadge({ stock, small }: { stock: number; small?: boolean }) {
  const getColor = () => {
    if (stock === 0) return 'bg-red-800/40 text-red-300 hover:bg-red-400/40';
    if (stock <= 5)
      return 'bg-yellow-800/40 text-yellow-300 hover:bg-yellow-400/40';
    if (stock <= 20) return 'bg-blue-800/40 text-blue-300 hover:bg-blue-400/40';
    return 'bg-green-800/40 text-green-300 hover:bg-green-400/40';
  };

  return (
    <Badge className={`${getColor()} ${small ? 'text-lg' : 'text-xl'}`}>
      {stock} units
    </Badge>
  );
}
