import { Order } from '@/types';
import { updateOrder } from '@/supabase/dashboard/updateOrder';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getSingleOrder } from '@/supabase/dashboard/getOrders';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

// export function useOrder(orderId: string, initialData?: Order) {
//   return useQuery({
//     queryKey: orderKeys.detail(orderId),
//     queryFn: async () => {
//       const order = await getSingleOrder(orderId);
//       if (!order) throw new Error('Order not found');
//       return order as Order;
//     },
//     initialData,
//   });
// }

export function useUpdateOrder(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Order>) => {
      const result = await updateOrder(orderId, updates);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onMutate: async newOrder => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(orderId) });

      // Snapshot the previous value
      const previousOrder = queryClient.getQueryData(orderKeys.detail(orderId));

      // Optimistically update the cache
      queryClient.setQueryData(
        orderKeys.detail(orderId),
        (oldOrder: Order | undefined) => {
          if (!oldOrder) return oldOrder;

          return {
            ...oldOrder,
            ...newOrder,
          };
        },
      );

      // Return a context object with the snapshot
      return { previousOrder };
    },
    // Rollback on error
    onError: (err, newOrder, context) => {
      toast.error(`Update failed: ${err.message}`);
      if (context?.previousOrder) {
        queryClient.setQueryData(
          orderKeys.detail(orderId),
          context.previousOrder,
        );
      }
    },
    onSuccess: () => {
      toast.success('Order updated successfully');
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    },
  });
}
