import { Clock, CheckCircle2, Truck, XCircle, RefreshCcw, BadgeCheck, LucideIcon } from 'lucide-react';

export type StatusKey = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderStatusConfig {
  id: StatusKey;
  label: string; // Bulgarian label for storefront and dashboard
  description?: string; // Long description for storefront tracking
  icon: LucideIcon;
  step?: number; // Step number for storefront tracking
  badgeClasses: string;
}

export const ORDER_STATUSES: Record<StatusKey, OrderStatusConfig> = {
  pending: {
    id: 'pending',
    label: 'Очаква потвърждение',
    description: 'Поръчката ви е получена и се обработва.',
    icon: Clock,
    step: 1,
    badgeClasses: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/30',
  },
  confirmed: {
    id: 'confirmed',
    label: 'Потвърдена',
    description: 'Поръчката ви е потвърдена и се подготвя за изпращане.',
    icon: BadgeCheck,
    step: 2,
    badgeClasses: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-500 border border-cyan-500/30',
  },
  processing: {
    id: 'processing',
    label: 'В процес на обработка',
    icon: RefreshCcw,
    badgeClasses: 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border border-blue-500/30',
  },
  shipped: {
    id: 'shipped',
    label: 'Изпратена',
    description: 'Поръчката ви е предадена на куриера.',
    icon: Truck,
    step: 3,
    badgeClasses: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30',
  },
  delivered: {
    id: 'delivered',
    label: 'Доставена',
    description: 'Поръчката е доставена успешно. Благодарим ви!',
    icon: CheckCircle2,
    step: 4,
    badgeClasses: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border border-emerald-500/30',
  },
  cancelled: {
    id: 'cancelled',
    label: 'Отказана',
    description: 'Поръчката е отказана.',
    icon: XCircle,
    step: 0,
    badgeClasses: 'bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500/30',
  },
  refunded: {
    id: 'refunded',
    label: 'Възстановена сума',
    icon: RefreshCcw,
    badgeClasses: 'bg-orange-500/10 text-orange-600 dark:text-orange-500 border border-orange-500/30',
  },
};

export const getOrderStatusConfig = (status: string | null | undefined): OrderStatusConfig => {
  const normalizedStatus = (status?.toLowerCase() ?? 'pending') as StatusKey;
  return ORDER_STATUSES[normalizedStatus] || ORDER_STATUSES.pending;
};

