'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { PayoutListResponse } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { PayoutDetailDrawer } from './PayoutDetailDrawer';

interface PayoutsTableProps {
  initialData: PayoutListResponse;
}

export function PayoutsTable({ initialData }: PayoutsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentLimit = Number(searchParams.get('limit')) || 20;
  const currentStatus = searchParams.get('status') || '';
  const currentRecipientType = searchParams.get('recipientType') || '';

  const totalPages = Math.ceil(initialData.total / currentLimit);

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset page on filter change
    if (key !== 'page') {
      params.set('page', '1');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    updateFilters('search', searchValue);
  };

  const clearSearch = () => {
    setSearchValue('');
    updateFilters('search', null);
  };

  return (
    <div className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-sm">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-[var(--color-outline-variant)]">
        <form onSubmit={handleSearch} className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar payouts (Order ID)..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-outline-variant)] bg-transparent py-2 pl-9 pr-9 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-colors"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={currentRecipientType}
            onChange={(e) => updateFilters('recipientType', e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-[var(--color-outline-variant)] bg-transparent py-2 px-4 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-[var(--color-on-surface)]"
          >
            <option value="">All Recipients</option>
            <option value="SELLER">Seller</option>
            <option value="DELIVERY">Delivery</option>
          </select>

          <select
            value={currentStatus}
            onChange={(e) => updateFilters('status', e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-[var(--color-outline-variant)] bg-transparent py-2 px-4 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-[var(--color-on-surface)]"
          >
            <option value="">Todos los estados</option>
            <option value="APPROVED">Aprobado</option>
            <option value="PENDING">Pendiente</option>
            <option value="REJECTED">Rechazado</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--color-outline-variant)] text-sm text-left">
          <thead className="bg-[var(--color-surface-container-low)]">
            <tr>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)]">Payout ID</th>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)]">Order ID</th>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)]">Recipient Type</th>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)]">Recipient ID</th>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)]">Monto</th>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)]">Estado</th>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)]">Fecha</th>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)] text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-outline-variant)]">
            {initialData.items && initialData.items.length > 0 ? (
              initialData.items.map((payout) => (
                <tr key={payout.id} className="hover:bg-[var(--color-surface-container-lowest)] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-[var(--color-on-surface)] max-w-[120px] truncate" title={payout.id}>
                    {payout.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-[var(--color-on-surface)]">
                    {payout.orderId}
                  </td>
                  <td className="px-6 py-4 font-medium text-[var(--color-on-surface-variant)] capitalize">
                    {payout.recipientType.toLowerCase()}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[var(--color-on-surface-variant)] max-w-[120px] truncate" title={payout.recipientId || ''}>
                    {payout.recipientId || 'N/A'}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[var(--color-on-surface)]">
                    ${Number(payout.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={payout.status} />
                  </td>
                  <td className="px-6 py-4 text-[var(--color-on-surface-variant)]">
                    {new Date(payout.createdAt).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedPayoutId(payout.id)}
                      className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-[var(--color-on-surface-variant)]">
                  No hay pagos encontrados con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--color-outline-variant)] px-6 py-4">
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Mostrando <span className="font-medium text-[var(--color-on-surface)]">{(currentPage - 1) * currentLimit + 1}</span> hasta{' '}
            <span className="font-medium text-[var(--color-on-surface)]">
              {Math.min(currentPage * currentLimit, initialData.total)}
            </span>{' '}
            de <span className="font-medium text-[var(--color-on-surface)]">{initialData.total}</span> payouts
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => updateFilters('page', (currentPage - 1).toString())}
              disabled={currentPage <= 1}
              className="flex items-center justify-center rounded border border-[var(--color-outline-variant)] px-2 py-1 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => updateFilters('page', (currentPage + 1).toString())}
              disabled={currentPage >= totalPages}
              className="flex items-center justify-center rounded border border-[var(--color-outline-variant)] px-2 py-1 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Drawer Modal */}
      <PayoutDetailDrawer
        payoutId={selectedPayoutId}
        onClose={() => setSelectedPayoutId(null)}
      />
    </div>
  );
}
