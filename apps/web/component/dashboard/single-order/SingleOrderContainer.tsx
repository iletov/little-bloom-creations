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
import { ProviderErrorModal } from '@/component/modals/ProviderErrorModal';

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
        
        <div className="mt-6 flex flex-col md:flex-row gap-4 border-t border-slate-600 pt-6">
          <Button 
            className="w-full md:w-auto h-12 text-[1.4rem] px-6  hover:bg-slate-100/80 transition-all duration-200 leading-normal tracking-wide"
            variant="default"
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
            {isGeneratingWaybill ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Товарителница
          </Button>
          


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
                variant="outline"
                className="w-full md:w-auto h-12 text-[1.4rem] px-6 bg-emerald-900 hover:bg-emerald-500/20 text-emerald-300 shadow-sm hover:shadow-md transition-all duration-200"
                disabled={isMarkingDelivered || optimisticStatus === 'delivered' || optimisticStatus === 'cancelled'}
              >
                {isMarkingDelivered ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                Mark as Delivered
              </Button>
            }
          />
          

          <div className="w-full md:w-auto md:ml-auto">
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
                  className="w-full md:w-auto h-12 text-[1.4rem] px-6 shadow-sm hover:shadow-md transition-all duration-200"
                  disabled={isCancelling || optimisticStatus === 'cancelled'} 
                >
                  {isCancelling ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  Cancel Order
                </Button>
              }
            />
          </div>
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

      <ProviderErrorModal 
        error={waybillError}
        onClose={() => setWaybillError(null)}
        title="Waybill Generation Failed"
        description="The courier API returned the following error. Please check the order details and try again."
      />

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
            <div className="space-y-4 p-4 pb-6">
            {data.order_items.map((item, index) => (
              <div key={item.id} className="bg-[#1f2937] border border-slate-700 rounded-lg overflow-hidden transition-all hover:border-slate-500 shadow-sm">
                <div onClick={() => handleOpenItem(item.id)} className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-[1.8rem] font-semibold text-white">{item.name}</h4>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600 px-2 py-0.5 text-[1.2rem]">SKU: {item.product_sku}</Badge>
                      {item.variant_name && <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600 px-2 py-0.5 text-[1.2rem]">{item.variant_name}</Badge>}
                      {item.variant_sku && <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600 px-2 py-0.5 text-[1.2rem]">Var: {item.variant_sku}</Badge>}
                      <span className="text-slate-400 text-[1.3rem] ml-1">Qty: <strong className="text-white">{item.quantity}</strong></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-1 shrink-0 border-t border-slate-700 pt-3 md:border-0 md:pt-0">
                    <div className="text-[1.8rem] font-semibold text-emerald-400">
                      {(item.subtotal || 0).toFixed(2)} EUR
                    </div>
                    <div className="text-[1.3rem] text-slate-400">
                      {(item.unit_price || 0).toFixed(2)} EUR / unit
                    </div>
                  </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen.includes(item.id) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-4 pt-0 border-t border-slate-700 bg-slate-800/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {/* Personalization Section */}
                      {item.personalization && Object.keys(item.personalization).length > 0 && (
                        <div>
                          <h5 className="text-[1.5rem] font-medium text-slate-300 mb-3 flex items-center gap-2">
                            <Pencil className="w-4 h-4" /> Personalization
                          </h5>
                          <div className="space-y-3 bg-slate-800 p-4 rounded-md border border-slate-700">
                            {item.personalization.name && (
                              <div className="flex justify-between items-center text-[1.4rem]">
                                <span className="text-slate-400">Name:</span>
                                <span className="font-medium text-white">{item.personalization.name}</span>
                              </div>
                            )}
                            {item.personalization.addMainText && item.personalization.addMainText !== 'no-text' && (
                              <div className="flex justify-between items-center text-[1.4rem]">
                                <span className="text-slate-400">Main Text:</span>
                                <span className="font-medium text-white capitalize">{item.personalization.addMainText}</span>
                              </div>
                            )}
                            {item.personalization.textColor && (
                              <div className="flex justify-between items-center text-[1.4rem]">
                                <span className="text-slate-400">Text Color:</span>
                                <span className="font-medium text-white capitalize">{item.personalization.textColor}</span>
                              </div>
                            )}
                            {item.personalization.personalizationType && item.personalization.personalizationType !== 'none' && (
                              <div className="flex justify-between items-center text-[1.4rem]">
                                <span className="text-slate-400">Type:</span>
                                <span className="font-medium text-white">
                                  {item.personalization.personalizationType === 'name-only' ? 'С име' : 'С име и бродерия'}
                                </span>
                              </div>
                            )}
                            {item.personalization.embroideryImage?.alt && (
                              <div className="flex justify-between items-center text-[1.4rem]">
                                <span className="text-slate-400">Embroidery:</span>
                                <div className="flex items-center gap-3">
                                  {item.personalization.embroideryImage.asset?.url ? (
                                    <img 
                                      src={item.personalization.embroideryImage.asset.url} 
                                      alt={item.personalization.embroideryImage.alt}
                                      className="w-24 h-24 object-contain bg-slate-700/50 rounded-md border border-slate-600 p-1"
                                    />
                                  ) : item.personalization.embroideryImage.url ? (
                                    <img 
                                      src={item.personalization.embroideryImage.url} 
                                      alt={item.personalization.embroideryImage.alt}
                                      className="w-12 h-12 object-contain bg-slate-700/50 rounded-md border border-slate-600 p-1"
                                    />
                                  ) : null}
                                  <span className="font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">{item.personalization.embroideryImage.alt}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Dimensions Section */}
                      {((item.dimensions && Object.keys(item.dimensions).length > 0) || item.weight) && (
                        <div>
                          <h5 className="text-[1.5rem] font-medium text-slate-300 mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4" /> Package & Dimensions
                          </h5>
                          <div className="space-y-3 bg-slate-800 p-4 rounded-md border border-slate-700">
                            <div className="flex justify-between items-center text-[1.4rem]">
                              <span className="text-slate-400">Weight:</span>
                              <span className="font-medium text-white">{item.weight || 0} kg</span>
                            </div>
                            {item.dimensions?.width && (
                              <div className="flex justify-between items-center text-[1.4rem]">
                                <span className="text-slate-400">Width:</span>
                                <span className="font-medium text-white">{item.dimensions.width}</span>
                              </div>
                            )}
                            {item.dimensions?.height && (
                              <div className="flex justify-between items-center text-[1.4rem]">
                                <span className="text-slate-400">Height:</span>
                                <span className="font-medium text-white">{item.dimensions.height}</span>
                              </div>
                            )}
                            {item.dimensions?.depth && (
                              <div className="flex justify-between items-center text-[1.4rem]">
                                <span className="text-slate-400">Depth:</span>
                                <span className="font-medium text-white">{item.dimensions.depth}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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



export default SingleOrderContainer;
