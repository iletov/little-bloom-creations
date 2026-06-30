import React from 'react';
import { getSingleProduct } from '@/supabase/lib/getAllProducts';
import { getAllProductsSanity } from '@/sanity/lib/fetch/fetchData';
import SingleProductContainer from '@/component/dashboard/single-product/SingleProductContainer';
import BackButton from '@/component/dashboard/back-button/BackButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, Edit } from 'lucide-react';

export default async function ProductDetail({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  
  // Fetch from our Postgres DB (pricing, stock, variants)
  const dbProduct = await getSingleProduct(sku);
  
  if (!dbProduct) {
    return (
      <section className="max-w-[1600px] p-10 space-y-8">
        <Link href={{ pathname: '/dashboard/products' }}>
          <Button variant="outline" size="icon" className="w-12 h-12 rounded-full border-slate-700 bg-[#20212b]">
            <ChevronLeft size={16} className="text-slate-400" />
          </Button>
        </Link>
        <div className="text-center py-20">
          <h1 className="text-2xl font-semibold">Product not found</h1>
          <p className="text-gray-600 mt-2">The product with SKU &quot;{sku}&quot; could not be found.</p>
        </div>
      </section>
    );
  }

  // Fetch Sanity data for images and description
  const sanityProducts = await getAllProductsSanity();
  const sanityData = sanityProducts?.find((p: any) => p.sku === sku);

  // Combine data
  const productData = {
    ...dbProduct,
    sanity: sanityData || null,
  };

  return (
    <section className="max-w-[1600px] p-10 pb-24 space-y-8">
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center gap-6">
          <BackButton />
          <h1 className="text-[2.4rem] font-semibold text-slate-200">Product Details</h1>
        </div>

        {(sanityData?._id || dbProduct.sanityId) && (
          <Link
            href={`/studio/intent/edit/id=${sanityData?._id || dbProduct.sanityId};type=productType`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="bg-[#20212b] border border-slate-700 hover:bg-[#30313b] text-slate-200 flex items-center gap-2 text-[1.4rem]">
              <Edit className="w-4 h-4" />
              Edit in Sanity
            </Button>
          </Link>
        )}
      </div>
      
      <SingleProductContainer data={productData} />
    </section>
  );
}
