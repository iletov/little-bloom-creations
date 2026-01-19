'use client';

import React, { useState } from 'react';
import { Order } from '@/types';
import { format } from 'date-fns';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateOrder } from '@/hooks/useOrder';

const SingleOrderContainer = ({ data }: { data: Order }) => {
  const [isOpen, setIsOpen] = useState<string[]>([]);
  // Use React Query for data fetching/caching
  // We pass initialData to hydrate the cache immediately
  // const { data } = useOrder(initialData.order_number, initialData);

  // Use custom hook for mutations
  // const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder(
  //   data.order_number,
  // );

  // Define order details with labels and editable configuration
  const orderDetails = [
    { label: 'Order Number', value: data.order_number },
    { label: 'Status', value: data.status },
    { label: 'Created At', value: format(new Date(data.created_at), 'PPpp') },
    { label: 'Payment Method', value: data.payment_method },
    { label: 'Delivery Method', value: data.delivery_method },
    { label: 'Delivery Company', value: data.delivery_company },
    { label: 'Shipment Number', value: data.shipment_number },
    {
      label: 'Subtotal',
      value: data.subtotal ? `${data.subtotal.toFixed(2)} EUR` : 'N/A',
    },
    {
      label: 'Delivery Cost',
      value: data.delivery_cost
        ? `${data.delivery_cost.toFixed(2)} EUR`
        : 'N/A',
    },
    {
      label: 'Total Amount',
      value: data.total_amount ? `${data.total_amount.toFixed(2)} EUR` : 'N/A',
    },
    {
      label: 'Total Amount',
      value: data.total_amount ? `${data.total_amount.toFixed(2)} EUR` : 'N/A',
    },
  ];

  const handleOpenItem = (id: string) => {
    if (isOpen.includes(id)) {
      setIsOpen(isOpen.filter(itemId => itemId !== id));
    } else {
      setIsOpen([...isOpen, id]);
    }
  };

  return (
    <section className="space-y-10 ">
      {/* Order Information */}
      <div className="bg-blue-dark rounded-lg border p-6">
        <h2 className="text-[2.4rem] font-semibold mb-4 border-b border-slate-600 pb-2">
          Order Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orderDetails.map((detail, index) => (
            <DetailRow key={index} label={detail.label} value={detail.value} />
          ))}
        </div>
      </div>

      {/* Shipping Information */}
      {data.order_shipping && (
        <div className="bg-blue-dark rounded-lg border p-6">
          <h2 className="text-[2.4rem] font-semibold mb-4 border-b border-slate-600 pb-2">
            Shipping Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              label="Full Name"
              value={data.order_shipping.full_name}
            />
            <DetailRow label="Email" value={data.order_shipping.email} />
            <DetailRow label="Phone" value={data.order_shipping.phone} />
            <DetailRow label="City" value={data.order_shipping.city} />
            <DetailRow label="Street" value={data.order_shipping.street} />
            <DetailRow
              label="Street Number"
              value={data.order_shipping.street_number}
            />
            <DetailRow
              label="Postal Code"
              value={data.order_shipping.postal_code}
            />
            <DetailRow label="Country" value={data.order_shipping.country} />
            {data.order_shipping.office_code && (
              <DetailRow
                label="Office Code"
                value={data.order_shipping.office_code}
              />
            )}
            {data.order_shipping.additional_info && (
              <DetailRow
                label="Additional Info"
                value={data.order_shipping.additional_info}
              />
            )}
          </div>
        </div>
      )}

      {/* Order Items */}
      {data.order_items && data.order_items.length > 0 && (
        <div className="bg-blue-dark rounded-lg border pb-4">
          <h2 className="text-[2.4rem] font-semibold mb-4 border-b border-slate-600 pb-2 m-4 ">
            Order Items
          </h2>
          <div className="space-y-4">
            {data.order_items.map((item, index) => (
              <div key={item.id} className="border-b last:border-b-0">
                <article
                  onClick={() => handleOpenItem(item.id)}
                  className="grid grid-cols-1 md:grid-cols-8 gap-4 bg-green-dark m-4 p-4 rounded-sm cursor-pointer">
                  <DetailRow label="Product Name" value={item.name} />
                  <DetailRow label="SKU" value={item.product_sku} />
                  {item.variant_name && (
                    <DetailRow label="Variant" value={item.variant_name} />
                  )}

                  <DetailRow label="Variant SKU" value={item?.variant_sku} />

                  <DetailRow
                    label="Quantity"
                    value={item.quantity.toString()}
                  />
                  <DetailRow label="Weight" value={`${item.weight} kg`} />
                  <DetailRow
                    label="Unit Price"
                    value={`${item.unit_price.toFixed(2)} EUR`}
                  />
                  <DetailRow
                    label="Subtotal"
                    value={`${item.subtotal.toFixed(2)} EUR`}
                  />
                </article>
                {/* === */}
                <div
                  className={`grid transition-[grid-template-rows] duration-150 ease-out ${
                    isOpen.includes(item.id)
                      ? 'grid-rows-[1fr]'
                      : 'grid-rows-[0fr]'
                  }`}>
                  <div className="overflow-hidden">
                    <article className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-4 px-4 mx-6 border-b-[1px] border-l-[1px] border-slate-600">
                      <div className="border-b pb-4 last:border-b-0">
                        <h3 className="text-[1.8rem] font-semibold mb-4 border-b border-slate-600 pb-2 mt-8 w-fit">
                          Personalization
                        </h3>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-20">
                          <DetailRow
                            label="Name"
                            value={item.personalization.name}
                          />
                          <DetailRow
                            label="Text Color"
                            value={item.personalization.textColor}
                          />
                          <DetailRow
                            label="Main Text"
                            value={item.personalization.addMainText}
                          />
                        </div>
                      </div>

                      <div className="border-b pb-4 last:border-b-0">
                        <h3 className="text-[1.8rem] font-semibold mb-4 border-b border-slate-600 pb-2 mt-8 w-fit">
                          Dimensions
                        </h3>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-20">
                          <DetailRow
                            label="Width"
                            value={item.dimensions.width}
                          />
                          <DetailRow
                            label="Height"
                            value={item.dimensions.height}
                          />
                          <DetailRow
                            label="Depth"
                            value={item.dimensions.depth}
                          />
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
                {/* === */}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

// Simple read-only row
const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="flex flex-col">
    <span className="text-[1.4rem] text-gray-500 font-medium">{label}</span>
    <span className="text-[1.8rem] text-gray-100 mt-1">{value || 'N/A'}</span>
  </div>
);

// Editable Row Component
// const EditableDetailRow = ({
//   label,
//   value,
//   fieldKey,
//   editable,
//   onUpdate,
//   isUpdating,
// }: {
//   label: string;
//   value?: string | number;
//   fieldKey: string;
//   editable?: boolean;
//   onUpdate: (value: string) => void;
//   isUpdating?: boolean;
// }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [inputValue, setInputValue] = useState(value || '');

//   const handleSave = () => {
//     if (inputValue === value) {
//       setIsEditing(false);
//       return;
//     }

//     // Call the update function passed from parent
//     onUpdate(inputValue as string);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setInputValue(value || '');
//     setIsEditing(false);
//   };

//   return (
//     <div className="flex flex-col relative group">
//       <span className="text-[1.4rem] text-gray-500 font-medium flex items-center gap-2">
//         {label}
//         {editable && !isEditing && (
//           <button
//             onClick={() => setIsEditing(true)}
//             className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:text-blue-300"
//             title="Edit">
//             <Pencil size={14} />
//           </button>
//         )}
//       </span>

//       {isEditing ? (
//         <div className="flex items-center gap-2 mt-1">
//           <Input
//             value={inputValue}
//             onChange={(e: any) => setInputValue(e.target.value)}
//             className="h-9 text-[1.6rem] bg-slate-900 border-slate-700 max-w-[200px]"
//             disabled={isUpdating}
//             autoFocus
//           />
//           <div className="flex items-center gap-1">
//             <Button
//               size="icon"
//               variant="secondary"
//               className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white"
//               onClick={handleSave}
//               disabled={isUpdating}>
//               {isUpdating ? (
//                 <Loader2 size={16} className="animate-spin" />
//               ) : (
//                 <Check size={16} />
//               )}
//             </Button>
//             <Button
//               size="icon"
//               variant="secondary"
//               className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white"
//               onClick={handleCancel}
//               disabled={isUpdating}>
//               <X size={16} />
//             </Button>
//           </div>
//         </div>
//       ) : (
//         <span className="text-[1.8rem] text-gray-100 mt-1">
//           {value || 'N/A'}
//         </span>
//       )}
//     </div>
//   );
// };

export default SingleOrderContainer;
