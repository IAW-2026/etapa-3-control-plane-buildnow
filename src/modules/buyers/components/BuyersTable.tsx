'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, Eye, UserX, UserCheck, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
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

  const totalPages = Math.max(1, Math.ceil(initialData.total / currentLimit));

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    if (key !== 'page') {
      params.set('page', '1');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusToggle = async (id: string, currentStatus: BuyerStatus) => {
    setIsUpdating(id);
    const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    await toggleBuyerStatusAction(id, newStatus);
    setIsUpdating(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateFilters('page', newPage.toString());
    }
  };

  // Generar páginas para paginación (imitando la lógica de seller)
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <span key={`ellipsis-${index}`} className="px-2 py-1 text-[var(--color-on-surface-variant)]">
            ...
          </span>
        );
      }
      return (
        <button
          key={page}
          onClick={() => handlePageChange(page as number)}
          className={`flex h-7 w-7 items-center justify-center rounded-md text-[13px] transition-colors ${
            currentPage === page
              ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
              : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-on-surface)]'
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Imitación de FilterBar */}
      <div className="flex items-center gap-2.5 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] px-4 py-3 rounded-t-xl border-x border-t">
        <span className="text-[var(--color-on-surface-variant)] [&>svg]:h-[15px] [&>svg]:w-[15px]">
          <Filter />
        </span>
        <span className="text-[13px] font-medium text-[var(--color-on-surface)]">Filtros</span>
        <div className="flex-1" />
        
        {/* Imitación de FilterInput */}
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateFilters('search', searchValue)}
            onBlur={() => updateFilters('search', searchValue)}
            placeholder="Buscar compradores por nombre o mail..."
            className="w-72 rounded-md border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-2.5 py-[5px] pr-8 text-[13px] text-[var(--color-on-surface)] outline-none transition-colors placeholder:text-[var(--color-on-surface-variant)] focus:border-[var(--color-primary)]"
          />
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue('');
                updateFilters('search', '');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Imitación de FilterSelect */}
        <div className="flex items-center gap-2 ml-4">
          <label className="whitespace-nowrap text-[12px] text-[var(--color-on-surface-variant)]">
            Estado
          </label>
          <select
            value={currentStatus}
            onChange={(e) => updateFilters('status', e.target.value)}
            className="cursor-pointer rounded-md border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-2.5 py-[5px] text-[13px] text-[var(--color-on-surface)] outline-none transition-colors focus:border-[var(--color-primary)]"
          >
            <option value="">Todos</option>
            <option value="ACTIVE">Activos</option>
            <option value="DISABLED">Deshabilitados</option>
          </select>
        </div>
      </div>

      <div className="-mt-4 overflow-hidden rounded-b-xl border-x border-b border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)]">Nombre</th>
                <th className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)]">Correo</th>
                <th className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)]">Teléfono</th>
                <th className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] px-4 py-2.5 text-center text-[11px] font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)]">Direcciones</th>
                <th className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)]">Estado</th>
                <th className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] px-4 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {initialData.items.length > 0 ? (
                initialData.items.map((buyer) => (
                  <tr key={buyer.id} className="border-b border-[var(--color-outline-variant)] last:border-0 hover:bg-[var(--color-surface-container-high)]">
                    <td className="px-4 py-[11px] font-medium text-[var(--color-on-surface)]">{buyer.name}</td>
                    <td className="px-4 py-[11px] text-[var(--color-on-surface-variant)]">{buyer.email}</td>
                    <td className="px-4 py-[11px] text-[var(--color-on-surface-variant)]">{buyer.phone}</td>
                    <td className="px-4 py-[11px] text-center">
                      <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[var(--color-surface-container-high)] text-xs font-medium text-[var(--color-on-surface)] px-2">
                        {buyer.addressesCount}
                      </span>
                    </td>
                    <td className="px-4 py-[11px]">
                      <BuyerStatusBadge status={buyer.status} />
                    </td>
                    <td className="px-4 py-[11px] text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedBuyerId(buyer.id)}
                          className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                          title="Ver Detalles"
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
                          title={buyer.status === 'ACTIVE' ? 'Deshabilitar' : 'Habilitar'}
                        >
                          {isUpdating === buyer.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : buyer.status === 'ACTIVE' ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[13px] text-[var(--color-on-surface-variant)]">
                    No se encontraron compradores que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Imitación de Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-2.5">
            <span className="text-[12px] text-[var(--color-on-surface-variant)]">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-on-surface)] disabled:pointer-events-none disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-on-surface)] disabled:pointer-events-none disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <BuyerDetailDrawer 
        buyerId={selectedBuyerId} 
        onClose={() => setSelectedBuyerId(null)} 
      />
    </div>
  );
}
