import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { productColumns } from './columns';

const ProductsContainer = ({
  data: products,
  variants,
}: {
  data: any;
  variants: any;
}) => {
  return (
    <section className="w-full min-h-[80svh] bg-gray-700 rounded-lg p-6">
      <div className="space-y-6">
        {/* <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-gray-400">Manage inventory and stock levels</p>
          </div>

          <div className="flex gap-2">

            <Button variant="secondary" asChild>
              <Link href="/dashboard/products/sync">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync from Sanity
              </Link>
            </Button>

           
            <Button variant="ghost" asChild>
              <Link
                href={`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio/desk/product`}
                target="_blank"
                rel="noopener noreferrer">
                <Plus className="mr-2 h-4 w-4" />
                Add Product (Sanity)
              </Link>
            </Button>
          </div>
        </div> */}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-[500]">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Variants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-[500]">{variants.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-[500] text-red-600">
                {products?.reduce((acc: number, product: any) => {
                  const productCount = product.current_stock <= 5 ? 1 : 0;
                  const variantCount =
                    product.variants?.filter((v: any) => v.current_stock <= 5)
                      .length || 0;
                  return acc + productCount + variantCount;
                }, 0) || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={productColumns}
              data={products}
              searchKey="sku"
              searchPlaceholder="Search by product SKU..."
              basePath="/dashboard/products"
              idKey="sku"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProductsContainer;
