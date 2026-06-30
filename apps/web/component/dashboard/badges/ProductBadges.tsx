import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockBadgeProps {
  stock: number;
  className?: string;
  showUnits?: boolean;
}

export function StockBadge({ stock, className, showUnits = false }: StockBadgeProps) {
  const stockColorClass = 
    stock === 0 ? 'bg-red-500/10 text-red-500 border-red-500/20' :
    stock <= 5 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
    'bg-green-500/10 text-green-500 border-green-500/20';

  return (
    <Badge variant="outline" className={cn(`rounded-full px-2 py-0.5 border text-[1.2rem]`, stockColorClass, className)}>
      {stock}{showUnits ? ' units' : ''}
    </Badge>
  );
}

interface ActiveStatusBadgeProps {
  isActive: boolean;
  className?: string;
  showIcon?: boolean;
}

export function ActiveStatusBadge({ isActive, className, showIcon = true }: ActiveStatusBadgeProps) {
  const statusColorClass = isActive 
    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
    : 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  return (
    <Badge variant="outline" className={cn(`rounded-full px-2 py-0.5 border text-[1.2rem] flex items-center gap-1.5 w-fit`, statusColorClass, className)}>
      {showIcon && (
        isActive ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
      )}
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
}
