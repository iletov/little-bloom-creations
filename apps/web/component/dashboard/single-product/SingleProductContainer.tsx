'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, Package, Euro } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import { PortableTextContainer } from '@/component/portabletext-container/PortableTextContainer';
import { StockBadge, ActiveStatusBadge } from '@/component/dashboard/badges/ProductBadges';

import { DashboardProduct, DashboardVariant } from '@/types';

interface SingleProductContainerProps {
  data: DashboardProduct;
}

const SingleProductContainer = ({ data }: SingleProductContainerProps) => {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const sanityImage = data.sanity?.images?.[0]?.asset?.url
    ? data.sanity.images[0].asset.url
    : data.sanity?.images?.[0]?.asset?._ref 
      ? urlFor(data.sanity.images[0])?.width(800).url() 
      : '/placeholder.png'; // Fallback image

  const productName = data.sanity?.name || `Product #${data.sku}`;
  const description = data.sanity?.description || 'No description available.';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-[1.6rem]">
      {/* Left Column: Image & Info */}
      <div className="lg:col-span-1 space-y-8">
        <Card className="bg-[#20212b] border-slate-700/50">
          <CardContent className="p-6">
            <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-[#1a1b23] border border-slate-700 mb-6">
              <Image 
                src={sanityImage || '/placeholder.png'} 
                alt={productName} 
                fill 
                className="object-cover"
                unoptimized
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-[2.2rem] font-semibold text-slate-100">{productName}</h2>
              <div className="flex items-center gap-4">
                <span className="text-slate-400 font-mono">SKU: {data.sku}</span>
                <ActiveStatusBadge isActive={data.isActive} />
              </div>
              <div className="text-slate-300 mt-4 leading-relaxed">
                <PortableTextContainer data={description} className="!text-slate-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Pricing & Variants */}
      <div className="lg:col-span-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-[#20212b] border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-[1.4rem] font-medium text-slate-400 flex items-center gap-2">
                <Euro className="w-5 h-5 text-emerald-500" /> Base Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[3.2rem] font-bold text-slate-100">
                {Number(data.price).toFixed(2)} €
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#20212b] border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-[1.4rem] font-medium text-slate-400 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" /> Total Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[3.2rem] font-bold text-slate-100">
                {data.currentStock} <span className="text-[1.8rem] text-slate-400 font-normal">units</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#20212b] border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-[2rem] text-slate-100">Product Variants</CardTitle>
          </CardHeader>
          <CardContent>
            {data.variants?.length ? (
              <div className="rounded-md border border-slate-700/50 overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#1a1b23]">
                    <TableRow className="border-b-slate-700/50 hover:bg-[#1a1b23]">
                      <TableHead className="text-[1.4rem] text-slate-400 font-medium w-[80px]"></TableHead>
                      <TableHead className="text-[1.4rem] text-slate-400 font-medium">Variant SKU</TableHead>
                      <TableHead className="text-[1.4rem] text-slate-400 font-medium">Name</TableHead>
                      <TableHead className="text-[1.4rem] text-slate-400 font-medium">Price</TableHead>
                      <TableHead className="text-[1.4rem] text-slate-400 font-medium">Stock</TableHead>
                      <TableHead className="text-[1.4rem] text-slate-400 font-medium text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.variants.map((variant: DashboardVariant) => {
                      // Match the Postgres variant with the Sanity variant to get its image
                      const sanityVariant = data.sanity?.variants?.find((v: any) => v.sku === variant.variant_sku);
                      const variantImage = sanityVariant?.images?.[0]?.asset?.url
                        ? sanityVariant.images[0].asset.url
                        : sanityVariant?.images?.[0]?.asset?._ref 
                          ? urlFor(sanityVariant.images[0])?.width(800).url() 
                          : sanityImage; // Fallback to main product image

                      return (
                      <TableRow 
                        key={variant.variant_sku} 
                        onClick={() => setSelectedVariant({ ...variant, image: variantImage })}
                        className="border-b-slate-700/50 hover:bg-[#30313b] transition-colors cursor-pointer"
                      >
                        <TableCell>
                          <div className="w-12 h-12 relative rounded-md overflow-hidden bg-[#1a1b23] border border-slate-700">
                            <Image 
                              src={variantImage} 
                              alt={variant.variant_name || 'Variant Image'} 
                              fill 
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-slate-300 text-[1.4rem]">{variant.variant_sku}</TableCell>
                        <TableCell className="text-slate-100 text-[1.4rem] font-medium">{variant.variant_name}</TableCell>
                        <TableCell className="text-slate-300 text-[1.4rem]">{Number(variant.price).toFixed(2)} €</TableCell>
                        <TableCell>
                          <StockBadge stock={variant.currentStock} />
                        </TableCell>
                        <TableCell className="text-right">
                          <ActiveStatusBadge isActive={variant.isActive} className="ml-auto" />
                        </TableCell>
                      </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-700 rounded-lg">
                <p className="text-slate-400 text-[1.6rem]">This product has no variants.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Variant Details Modal */}
      <Dialog open={!!selectedVariant} onOpenChange={(open) => !open && setSelectedVariant(null)}>
        <DialogContent className="bg-[#20212b] border-slate-700 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[2rem]">{selectedVariant?.variantName}</DialogTitle>
            <DialogDescription className="text-slate-400 font-mono">
              SKU: {selectedVariant?.variantSku}
            </DialogDescription>
          </DialogHeader>
          
          {selectedVariant && (
            <div className="space-y-6 mt-4">
              <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-[#1a1b23] border border-slate-700">
                <Image 
                  src={selectedVariant.image} 
                  alt={selectedVariant.variantName || 'Variant Image'} 
                  fill 
                  className="object-contain"
                  unoptimized
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#1a1b23] border border-slate-700/50 rounded-lg p-4 flex flex-col justify-center">
                  <div className="text-slate-400 text-[1.2rem] uppercase tracking-wider mb-2">Price</div>
                  <div className="text-[2.2rem] font-bold text-slate-100">
                    {Number(selectedVariant.price).toFixed(2)} €
                  </div>
                </div>
                <div className="bg-[#1a1b23] border border-slate-700/50 rounded-lg p-4 flex flex-col justify-center items-start">
                  <div className="text-slate-400 text-[1.2rem] uppercase tracking-wider mb-2">Stock</div>
                  <StockBadge stock={selectedVariant.currentStock} showUnits className="px-4 py-1 text-[1.6rem]" />
                </div>
                <div className="bg-[#1a1b23] border border-slate-700/50 rounded-lg p-4 flex flex-col justify-center items-start">
                  <div className="text-slate-400 text-[1.2rem] uppercase tracking-wider mb-2">Status</div>
                  <ActiveStatusBadge isActive={selectedVariant.isActive} className="px-4 py-1 text-[1.6rem]" />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SingleProductContainer;
