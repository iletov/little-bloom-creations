'use client';

import React, { useState } from 'react';
import { ConfirmModal } from '../modals/ConfirmModal';
import { OrderStatus } from '@repo/shared-types';
import { Order } from '@/types';
import { format } from 'date-fns';
import { Pencil, Check, X, Loader2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUpdateOrder, useGenerateWaybill, useCancelOrder, useMarkAsDelivered } from '@/hooks/useOrder';
import { cn } from '@/lib/utils';
import { deliveryConfig, paymentConfig } from '../badge-configs';
import { getOrderStatusConfig } from '@/config/order-status';
import { Package, Clock, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SingleOrderContainer = ({ data }: { data: Order }) => {
  const [isOpen, setIsOpen] = useState<string[]>([]);
  const [showWaybillModal, setShowWaybillModal] = useState(false);
  const [waybillError, setWaybillError] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);
  
  // Optimistic UI states
  const [optimisticShipmentNumber, setOptimisticShipmentNumber] = useState<string | null>(data.shipment_number || null);
  const [optimisticStatus, setOptimisticStatus] = useState<string>(data.status);
  const [optimisticDeliveryCost, setOptimisticDeliveryCost] = useState<string | null>(data.delivery_cost ? String(data.delivery_cost) : null);
  
  const router = useRouter();

  const { mutate: generateWaybill, isPending: isGeneratingWaybill } = useGenerateWaybill(data.id);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder(data.id);
  const { mutate: markAsDelivered, isPending: isMarkingDelivered } = useMarkAsDelivered(data.id);

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
    { label: 'Status', value: optimisticStatus, isStatus: true },
    { label: 'Created At', value: format(new Date(data.created_at), 'PPpp') },
    { label: 'Payment Method', value: data.payment_method, isPayment: true },
    { label: 'Delivery Method', value: data.delivery_method, isDelivery: true },
    { label: 'Delivery Company', value: data.delivery_company, isCompany: true },
    {
      label: 'Shipment Number',
      value: optimisticShipmentNumber,
      isCopyable: true,
    },
    {
      label: 'Subtotal',
      value: data.subtotal ? `${data.subtotal.toFixed(2)} EUR` : (data.total_amount ? `${data.total_amount.toFixed(2)} EUR` : 'N/A'),
    },
    {
      label: 'Delivery Cost',
      value: optimisticDeliveryCost
        ? `${Number(optimisticDeliveryCost).toFixed(2)} EUR`
        : 'N/A',
    },
    {
      label: 'Total Amount',
      value: data.total_amount 
        ? `${data.total_amount.toFixed(2)} EUR` 
        : 'N/A',
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
      <Card>
        <CardHeader className="border-b border-slate-700/50 pb-4 mb-4">
          <CardTitle className="text-[2.4rem]">Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orderDetails.map((detail, index) => (
            <DetailRow key={index} label={detail.label} value={detail.value} isStatus={detail.isStatus} isCompany={detail.isCompany} isDelivery={detail.isDelivery} isPayment={detail.isPayment} isCopyable={detail.isCopyable} />
          ))}
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-600 pt-4">
          <Button 
            variant="blue"
            disabled={isGeneratingWaybill || !!optimisticShipmentNumber || optimisticStatus === 'cancelled'} 
            onClick={() => {
              generateWaybill(undefined, {
                onSuccess: (resultData) => {
                  setOptimisticShipmentNumber(resultData.shipmentNumber || null);
                  setOptimisticStatus('shipped');
                  if (resultData.shipmentData?.totalPrice) {
                    setOptimisticDeliveryCost(String(resultData.shipmentData.totalPrice));
                  }
                  setShowWaybillModal(true);
                  router.refresh();
                },
                onError: (error) => {
                  setWaybillError(error.message);
                }
              });
            }}
          >
            {isGeneratingWaybill ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Waybill
          </Button>
          
          <ConfirmModal
            open={isCancelModalOpen}
            onOpenChange={setIsCancelModalOpen}
            title="Cancel Order"
            description="Are you sure you want to cancel this order? This action will set the order status to Cancelled and restock the items. This cannot be easily undone."
            confirmText="Yes, Cancel Order"
            variant="destructive"
            isLoading={isCancelling}
            onConfirm={() => cancelOrder(undefined, {
              onSuccess: () => {
                setOptimisticStatus('cancelled');
                setIsCancelModalOpen(false);
                router.refresh();
              }
            })}
            trigger={
              <Button 
                variant="destructive"
                disabled={isCancelling || optimisticStatus === 'cancelled'} 
              >
                {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Cancel Order
              </Button>
            }
          />

          <ConfirmModal
            open={isDeliverModalOpen}
            onOpenChange={setIsDeliverModalOpen}
            title="Mark as Delivered"
            description="Are you sure you want to mark this order as delivered? This confirms the order has been received by the customer."
            confirmText="Yes, Mark as Delivered"
            variant="default"
            isLoading={isMarkingDelivered}
            onConfirm={() => markAsDelivered(undefined, {
              onSuccess: () => {
                setOptimisticStatus('delivered');
                router.refresh();
              }
            })}
            trigger={
              <Button
                variant="default"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isMarkingDelivered || optimisticStatus === 'delivered' || optimisticStatus === 'cancelled'}
              >
                {isMarkingDelivered ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Mark as Delivered
              </Button>
            }
          />
        </div>
        </CardContent>
      </Card>

      <Dialog open={showWaybillModal} onOpenChange={setShowWaybillModal}>
        <DialogContent className="sm:max-w-lg bg-blue-dark text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-[2.2rem] font-semibold">Waybill Generated Successfully</DialogTitle>
            <DialogDescription className="text-[1.4rem] text-slate-300">
              The shipment number has been assigned to this order.
            </DialogDescription>
          </DialogHeader>
          <CardContent>
            <div className="flex items-center space-x-2 py-6">
              <div className="flex flex-col flex-1 gap-2">
                <span className="text-[1.4rem] font-medium text-slate-400">Shipment Number</span>
                <div className="flex items-center gap-4">
                  <span className="text-[2.4rem] font-bold text-white tracking-wider">{optimisticShipmentNumber || 'Loading...'}</span>
                  {optimisticShipmentNumber && (
                    <CopyButton textToCopy={optimisticShipmentNumber} size={20} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors text-slate-300 hover:text-white" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowWaybillModal(false)}
            >
              Close
            </Button>
            {data.delivery_method?.includes('ekont') && optimisticShipmentNumber && (
              <Button 
                type="button" 
                variant="blue"
                onClick={() => window.open(`https://ee.econt.com/services/Shipments/ShipmentService.printLabels.pdf?shipmentNumbers=${optimisticShipmentNumber}`, '_blank')}
              >
                View PDF Label
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!waybillError} onOpenChange={(open) => !open && setWaybillError(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-blue-dark text-white border-red-500">
          <DialogHeader>
            <DialogTitle className="text-red-400">Error Generating Waybill</DialogTitle>
            <DialogDescription className="text-slate-300">
              The courier API returned the following error. Please check the order details and try again.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <pre className="bg-slate-900 p-4 rounded-md text-[1.4rem] text-red-300 whitespace-pre-wrap break-all">
              {(() => {
                if (!waybillError) return '';
                try {
                  const parsed = JSON.parse(waybillError);
                  return JSON.stringify(parsed, null, 2);
                } catch {
                  return waybillError;
                }
              })()}
            </pre>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => setWaybillError(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shipping Information */}
      {data.order_shipping && (
        <Card>
          <CardHeader className="border-b border-slate-700/50 pb-4 mb-4">
            <CardTitle className="text-[2.4rem]">Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              label="Full Name"
              value={data.order_shipping.full_name}
            />
            <DetailRow label="Email" value={data.order_shipping.email} isCopyable={true} />
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
        </CardContent>
      </Card>
      )}

      {/* Order Items */}
      {data.order_items && data.order_items.length > 0 && (
        <Card>
          <CardHeader className="border-b border-slate-700/50 pb-4 mb-4">
            <CardTitle className="text-[2.4rem]">Order Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
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
                            value={item.personalization?.name}
                          />
                          <DetailRow
                            label="Text Color"
                            value={item.personalization?.textColor}
                          />
                          <DetailRow
                            label="Main Text"
                            value={item.personalization?.addMainText}
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
                            value={item.dimensions?.width}
                          />
                          <DetailRow
                            label="Height"
                            value={item.dimensions?.height}
                          />
                          <DetailRow
                            label="Depth"
                            value={item.dimensions?.depth}
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
          </CardContent>
        </Card>
      )}
    </section>
  );
};



const CopyButton = ({ textToCopy, size = 16, className }: { textToCopy: string, size?: number, className?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={className || "p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? <Check size={size} className="text-green-400" /> : <Copy size={size} />}
    </button>
  );
};

// Simple read-only row
const DetailRow = ({
  label,
  value,
  isStatus,
  isCompany,
  isDelivery,
  isPayment,
  isCopyable,
}: {
  label: string;
  value?: string | number | null;
  isStatus?: boolean;
  isCompany?: boolean;
  isDelivery?: boolean;
  isPayment?: boolean;
  isCopyable?: boolean;
}) => {
  let badgeConfig = null;
  if (isStatus) {
    const orderStatusConfig = getOrderStatusConfig(String(value));
    const StatusIcon = orderStatusConfig.icon;
    return (
      <div className="flex flex-col">
        <span className="text-[1.4rem] text-gray-500 font-medium">{label}</span>
        <Badge
          variant="outline"
          className={cn("px-3 py-1 text-[1.2rem] border gap-1.5 w-fit rounded-full", orderStatusConfig.badgeClasses)}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {orderStatusConfig.label}
        </Badge>
      </div>
    );
  }
  else if (isCompany || isDelivery) badgeConfig = deliveryConfig[String(value).toLowerCase()] || { className: 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20', icon: Package };
  else if (isPayment) badgeConfig = paymentConfig[String(value).toLowerCase()] || { className: 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20', icon: CreditCard };

  return (
    <div className="flex flex-col">
      <span className="text-[1.4rem] text-gray-500 font-medium">{label}</span>
      {badgeConfig ? (
        <Badge variant="outline" className={`mt-1 rounded-full px-3 py-1 flex items-center w-fit gap-1.5 border ${badgeConfig.className}`}>
          <badgeConfig.icon className="w-3.5 h-3.5" />
          <span className="text-[1.2rem] uppercase">{String(value)?.replace(/_/g, ' ')}</span>
        </Badge>
      ) : (
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[1.8rem] text-gray-100">{value || 'N/A'}</span>
          {isCopyable && value && (
            <CopyButton textToCopy={String(value)} />
          )}
        </div>
      )}
    </div>
  );
};

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
