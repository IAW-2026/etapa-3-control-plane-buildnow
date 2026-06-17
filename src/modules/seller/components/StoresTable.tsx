'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { FilterBar, FilterInput } from '@/modules/seller/components/FilterBar';
import { StatusBadge } from '@/modules/seller/components/StatusBadge';
import { StoreToggle } from '@/modules/seller/components/StoreToggle';
import type { Store, Order } from '@/modules/seller/types';

interface StoresTableProps {
  stores: Store[];
  orders: Order[];
  onToggleStore: (id: string) => void;
}

function EmptyRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td
        colSpan={cols}
        className="py-8 text-center text-[13px] text-[var(--color-on-surface-variant)]"
      >
        Sin resultados
      </td>
    </tr>
  );
}

export function StoresTable({ stores, orders, onToggleStore }: StoresTableProps) {
  const [query, setQuery] = useState('');

  const orderCountByStore = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.storeId] = (acc[order.storeId] ?? 0) + 1;
    return acc;
  }, {});

  const filtered = query.trim()
    ? stores.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    : stores;

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
      <FilterBar icon={<Building2 />} title="Tiendas">
        <FilterInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar tienda..."
          ariaLabel="Buscar tienda"
        />
      </FilterBar>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {['Tienda', 'Dirección', 'Órdenes', 'Estado', ''].map((col, i) => (
                <th
                  key={i}
                  className={`border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)] ${
                    i === 4 ? 'text-right' : ''
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <EmptyRow cols={5} />
            ) : (
              filtered.map((store) => (
                <tr
                  key={store.id}
                  className="border-b border-[var(--color-outline-variant)] last:border-0 hover:bg-[var(--color-surface-container-high)]"
                >
                  <td className="px-4 py-[11px] font-medium text-[var(--color-on-surface)]">
                    {store.name}
                  </td>
                  <td className="px-4 py-[11px] text-[var(--color-on-surface-variant)]">
                    {store.address}
                  </td>
                  <td className="px-4 py-[11px] text-[var(--color-on-surface)]">
                    {orderCountByStore[store.id] ?? 0}
                  </td>
                  <td className="px-4 py-[11px]">
                    <StatusBadge status={store.status} />
                  </td>
                  <td className="px-4 py-[11px] text-right">
                    <StoreToggle
                      status={store.status}
                      storeName={store.name}
                      onToggle={() => onToggleStore(store.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
