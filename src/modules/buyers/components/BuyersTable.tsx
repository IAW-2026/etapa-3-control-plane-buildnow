'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X, ChevronLeft, ChevronRight, Eye, UserX, UserCheck } from 'lucide-react';
import { Buyer, BuyerListResponse, BuyerStatus } from '../types';
import { BuyerStatusBadge } from './BuyerStatusBadge';
import { BuyerDetailDrawer } from './BuyerDetailDrawer';
import { toggleBuyerStatusAction } from '../actions/buyerControlPlaneActions';

interface BuyersTableProps {
  initialData: BuyerListResponse;
}

export function BuyersTable({ initialData }: BuyersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentLimit = Number(searchParams.get('limit')) || 20;
  const currentStatus = searchParams.get('status') || '';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('search', searchValue);
  };

  const clearSearch = () => {
    setSearchValue('');
    updateFilters('search', null);
  };

  const handleStatusToggle = async (id: string, currentStatus: BuyerStatus) => {
    setIsUpdating(id);
    const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    await toggleBuyerStatusAction(id, newStatus);
    setIsUpdating(null);
  };

  return (
    <div className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-sm">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-[var(--color-outline-variant)]">
        <form onSubmit={handleSearch} className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Search buyers..."
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

        <select
          value={currentStatus}
          onChange={(e) => updateFilters('status', e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-[var(--color-outline-variant)] bg-transparent py-2 px-4 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-[var(--color-on-surface)]"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DISABLED">Disabled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--color-outline-variant)] text-sm text-left">
          <thead className="bg-[var(--color-surface-container-low)]">
            <tr>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)]">Name</th>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)]">Email</th>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)]">Phone</th>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)] text-center">Addresses</th>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)]">Status</th>
              <th className="px-6 py-3 font-medium text-[var(--color-on-surface-variant)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-outline-variant)]">
            {initialData.items.length > 0 ? (
              initialData.items.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-[var(--color-surface-container-lowest)] transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--color-on-surface)]">{buyer.name}</td>
                  <td className="px-6 py-4 text-[var(--color-on-surface-variant)]">{buyer.email}</td>
                  <td className="px-6 py-4 text-[var(--color-on-surface-variant)]">{buyer.phone}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[var(--color-surface-container-high)] text-xs font-medium text-[var(--color-on-surface)] px-2">
                      {buyer.addressesCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <BuyerStatusBadge status={buyer.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedBuyerId(buyer.id)}
                        className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatusToggle(buyer.id, buyer.status)}
                        disabled={isUpdating === buyer.id}
                        className={`rounded p-1.5 transition-colors disabled:opacity-50 ${
                          buyer.status === 'ACTIVE' 
                            ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20' 
                            : 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20'
                        }`}
                        title={buyer.status === 'ACTIVE' ? 'Disable Buyer' : 'Enable Buyer'}
                      >
                        {buyer.status === 'ACTIVE' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-[var(--color-on-surface-variant)]">
                  No buyers found matching the current filters.
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
            Showing <span className="font-medium text-[var(--color-on-surface)]">{(currentPage - 1) * currentLimit + 1}</span> to{' '}
            <span className="font-medium text-[var(--color-on-surface)]">
              {Math.min(currentPage * currentLimit, initialData.total)}
            </span>{' '}
            of <span className="font-medium text-[var(--color-on-surface)]">{initialData.total}</span> buyers
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
      <BuyerDetailDrawer 
        buyerId={selectedBuyerId} 
        onClose={() => setSelectedBuyerId(null)} 
      />
    </div>
  );
}
