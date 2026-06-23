import { Clock, CheckCircle2, Truck, XCircle, RefreshCcw, BadgeCheck, LucideIcon } from 'lucide-react';

export type StatusKey = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderStatusConfig {
  id: StatusKey;
  label: string; // Bulgarian label for storefront and dashboard
  description?: string; // Long description for storefront tracking
  icon: LucideIcon;
  step?: number; // Step number for storefront tracking
  storefront: {
    color: string;
    bg: string;
    border: string;
  };
  dashboard: {
    className: string;
  };
}

export const ORDER_STATUSES: Record<StatusKey, OrderStatusConfig> = {
  pending: {
    id: 'pending',
    label: 'Очаква потвърждение',
    description: 'Поръчката ви е получена и се обработва.',
    icon: Clock,
    step: 1,
    storefront: {
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    dashboard: {
      className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20',
    },
  },
  confirmed: {
    id: 'confirmed',
    label: 'Потвърдена',
    description: 'Поръчката ви е потвърдена и се подготвя за изпращане.',
    icon: BadgeCheck,
    step: 2,
    storefront: {
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    dashboard: {
      className: 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20',
    },
  },
  processing: {
    id: 'processing',
    label: 'В процес на обработка',
    icon: RefreshCcw,
    storefront: {
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
    },
    dashboard: {
      className: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20',
    },
  },
  shipped: {
    id: 'shipped',
    label: 'Изпратена',
    description: 'Поръчката ви е предадена на куриера.',
    icon: Truck,
    step: 3,
    storefront: {
      color: 'text-green-9',
      bg: 'bg-green-1/60',
      border: 'border-green-5',
    },
    dashboard: {
      className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
    },
  },
  delivered: {
    id: 'delivered',
    label: 'Доставена',
    description: 'Поръчката е доставена успешно. Благодарим ви!',
    icon: CheckCircle2,
    step: 4,
    storefront: {
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    dashboard: {
      className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20',
    },
  },
  cancelled: {
    id: 'cancelled',
    label: 'Отказана',
    description: 'Поръчката е отказана.',
    icon: XCircle,
    step: 0,
    storefront: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    dashboard: {
      className: 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20',
    },
  },
  refunded: {
    id: 'refunded',
    label: 'Възстановена сума',
    icon: RefreshCcw,
    storefront: {
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
    },
    dashboard: {
      className: 'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20',
    },
  },
};

export const getOrderStatusConfig = (status: string | null | undefined): OrderStatusConfig => {
  const normalizedStatus = (status?.toLowerCase() ?? 'pending') as StatusKey;
  return ORDER_STATUSES[normalizedStatus] || ORDER_STATUSES.pending;
};
