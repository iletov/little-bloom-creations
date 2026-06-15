import { Clock, CheckCircle2, Truck, XCircle, RefreshCcw, Building2, MapPin, Package, CreditCard, Banknote } from 'lucide-react';

export const statusConfig: Record<string, { className: string; icon: any }> = {
  pending: {
    className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20',
    icon: Clock,
  },
  confirmed: {
    className: 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20',
    icon: CheckCircle2,
  },
  processing: {
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20',
    icon: RefreshCcw,
  },
  shipped: {
    className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
    icon: Truck,
  },
  delivered: {
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20',
    icon: CheckCircle2,
  },
  cancelled: {
    className: 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20',
    icon: XCircle,
  },
  refunded: {
    className: 'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20',
    icon: RefreshCcw,
  },
};

export const deliveryConfig: Record<string, { className: string; icon: any }> = {
  ekont: {
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
    icon: Package,
  },
  speedy: {
    className: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
    icon: Package,
  },
  delivery: {
    className: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20',
    icon: MapPin,
  },
  office: {
    className: 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20',
    icon: Building2,
  },
};

export const paymentConfig: Record<string, { className: string; icon: any }> = {
  stripe: {
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
    icon: CreditCard,
  },
  bank: {
    className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
    icon: Building2,
  },
  cash: {
    className: 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20',
    icon: Banknote,
  },
};
