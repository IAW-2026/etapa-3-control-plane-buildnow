'use client';

import { Loader2 } from 'lucide-react';
import { FilterBar, FilterInput } from '@/modules/seller/components/FilterBar';
import { StatusBadge } from '@/modules/seller/components/StatusBadge';
import { StoreStatusSelect } from '@/modules/seller/components/StoreStatusSelect';
import { Pagination } from '@/modules/seller/components/Pagination';
import type { Store, Order } from '@/modules/seller/types';
import { StoreStatus } from '@/modules/seller/types';

interface StoresTableProps {
  stores: Store[];
  orders: Order[];
  loading?: boolean;
  /** ID de tienda cuyo estado se está actualizando actualmente (muestra loading) */
  updatingStoreId?: string | null;
  onStatusChange: (id: string, status: StoreStatus) => void;
  /** Paginación controlada desde el padre */
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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
          <span>Cargando tiendas...</span>
        </div>
      </td>
    </tr>
  );
}

export function StoresTable({
  stores,
  loading,
  updatingStoreId,
  onStatusChange,
  currentPage,
  totalPages,
  onPageChange,
}: StoresTableProps) {

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {['Tienda', 'Dirección', 'Estado', 'Cambiar estado'].map((col, i) => (
                <th
                  key={i}
                  className={`border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)] ${i === 4 ? 'text-right' : ''
                    }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingRow cols={4} />
            ) : stores.length === 0 ? (
              <EmptyRow cols={4} />
            ) : (
              stores.map((store) => (
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
                  <td className="px-4 py-[11px]">
                    <StatusBadge status={store.status} />
                  </td>
                  <td className="px-4 py-[11px]">
                    <StoreStatusSelect
                      status={store.status}
                      storeName={store.name}
                      loading={updatingStoreId === store.id}
                      onStatusChange={(status) => onStatusChange(store.id, status)}
                    />
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
