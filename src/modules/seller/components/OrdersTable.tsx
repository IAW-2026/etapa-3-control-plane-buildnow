'use client';

import { Loader2, ShoppingCart } from 'lucide-react';
import { FilterBar, FilterSelect } from '@/modules/seller/components/FilterBar';
import { StatusBadge } from '@/modules/seller/components/StatusBadge';
import { Pagination } from '@/modules/seller/components/Pagination';
import { OrderStatus, ORDER_STATUS_LABELS } from '@/modules/seller/types';
import type { Order, Store } from '@/modules/seller/types';

interface OrdersTableProps {
  orders: Order[];
  stores: Store[];
  loading?: boolean;
  /** Filtros controlados desde el padre */
  storeFilter: string;
  statusFilter: string;
  onStoreFilterChange: (storeId: string) => void;
  onStatusFilterChange: (status: string) => void;
  /** Paginación controlada desde el padre */
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Todos' },
  ...Object.values(OrderStatus).map((s) => ({
    value: s,
    label: ORDER_STATUS_LABELS[s],
  })),
];

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount);
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

function LoadingRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td
        colSpan={cols}
        className="py-8 text-center text-[13px] text-[var(--color-on-surface-variant)]"
      >
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Cargando órdenes...</span>
        </div>
      </td>
    </tr>
  );
}

export function OrdersTable({
  orders,
  stores,
  loading,
  storeFilter,
  statusFilter,
  onStoreFilterChange,
  onStatusFilterChange,
  currentPage,
  totalPages,
  onPageChange,
}: OrdersTableProps) {
  const storeOptions = [
    { value: '', label: 'Todas' },
    ...stores.map((s) => ({ value: s.id, label: s.name })),
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
      <FilterBar icon={<ShoppingCart />} title="Órdenes">
        <FilterSelect
          id="orders-store-filter"
          label="Tienda"
          value={storeFilter}
          onChange={onStoreFilterChange}
          options={storeOptions}
        />
        <FilterSelect
          id="orders-status-filter"
          label="Estado"
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={STATUS_FILTER_OPTIONS}
        />
      </FilterBar>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {['#', 'Comprador', 'Tienda', 'Total', 'Estado', 'Fecha'].map((col) => (
                <th
                  key={col}
                  className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingRow cols={6} />
            ) : orders.length === 0 ? (
              <EmptyRow cols={6} />
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[var(--color-outline-variant)] last:border-0 hover:bg-[var(--color-surface-container-high)]"
                >
                  <td className="px-4 py-[11px] font-medium text-[var(--color-on-surface-variant)]">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-[11px] font-mono text-[12px] text-[var(--color-on-surface)]">
                    {order.buyerId}
                  </td>
                  <td className="px-4 py-[11px] text-[var(--color-on-surface-variant)]">
                    {order.store.name}
                  </td>
                  <td className="px-4 py-[11px] font-medium text-[var(--color-on-surface)]">
                    {formatAmount(order.totalAmount)}
                  </td>
                  <td className="px-4 py-[11px]">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-[11px] text-[var(--color-on-surface-variant)]">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
