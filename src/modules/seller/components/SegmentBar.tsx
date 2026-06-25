'use client';

import { Building2, ShoppingCart, Package } from 'lucide-react';
import type { ManagementView } from '@/modules/seller/types';

interface SegmentBarProps {
  activeView: ManagementView;
  onChange: (view: ManagementView) => void;
}

const TABS: { view: ManagementView; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { view: 'stores', label: 'Tiendas', Icon: Building2 },
  { view: 'orders', label: 'Órdenes', Icon: ShoppingCart },
  { view: 'products', label: 'Productos', Icon: Package },
];

export function SegmentBar({ activeView, onChange }: SegmentBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Sección activa"
      className="flex gap-0 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] p-[3px]"
    >
      {TABS.map(({ view, label, Icon }) => {
        const isActive = activeView === view;
        return (
          <button
            key={view}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(view)}
            className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-[18px] py-[6px] text-[13px] font-medium transition-all duration-150 ${
              isActive
                ? 'border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-on-surface)] shadow-sm'
                : 'border-transparent bg-transparent font-normal text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            <Icon className="h-[15px] w-[15px]" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
