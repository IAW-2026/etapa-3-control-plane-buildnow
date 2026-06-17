'use client';

import { OrderStatus, StoreStatus, ORDER_STATUS_LABELS, STORE_STATUS_LABELS } from '@/modules/seller/types';

interface StatusBadgeProps {
  status: OrderStatus | StoreStatus;
}

type BadgeVariant = 'green' | 'amber' | 'red' | 'gray' | 'blue';

const ORDER_STATUS_VARIANT: Record<OrderStatus, BadgeVariant> = {
  [OrderStatus.DELIVERED]: 'green',
  [OrderStatus.CONFIRMED]: 'green',
  [OrderStatus.PENDING_PAYMENT]: 'amber',
  [OrderStatus.READY]: 'amber',
  [OrderStatus.ON_THE_WAY]: 'blue',
  [OrderStatus.CANCELLED]: 'red',
};

const STORE_STATUS_VARIANT: Record<StoreStatus, BadgeVariant> = {
  [StoreStatus.OPEN]: 'green',
  [StoreStatus.CLOSE]: 'gray',
  [StoreStatus.SUSPENDED]: 'red',
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  green: 'bg-[#EAF3DE] text-[#3B6D11]',
  amber: 'bg-[#FAEEDA] text-[#854F0B]',
  red: 'bg-[#FCEBEB] text-[#A32D2D]',
  gray: 'bg-[#F1EFE8] text-[#5F5E5A]',
  blue: 'bg-[#E0EFFE] text-[#1B4F9E]',
};

function isOrderStatus(status: OrderStatus | StoreStatus): status is OrderStatus {
  return Object.values(OrderStatus).includes(status as OrderStatus);
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = isOrderStatus(status)
    ? ORDER_STATUS_VARIANT[status]
    : STORE_STATUS_VARIANT[status];

  const label = isOrderStatus(status)
    ? ORDER_STATUS_LABELS[status]
    : STORE_STATUS_LABELS[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${VARIANT_CLASSES[variant]}`}
    >
      {label}
    </span>
  );
}
