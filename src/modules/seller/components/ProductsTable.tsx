'use client';

import { Loader2, Package } from 'lucide-react';
import { FilterBar, FilterSelect } from '@/modules/seller/components/FilterBar';
import { Pagination } from '@/modules/seller/components/Pagination';
import type { ProductItem } from '@/modules/seller/types';

interface ProductsTableProps {
  products: ProductItem[];
  loading?: boolean;
  /** Filtros controlados desde el padre */
  categoryFilter: string;
  categories: { id: string; name: string }[];
  onCategoryFilterChange: (categoryId: string) => void;
  storeFilter: string;
  stores: { id: string; name: string }[];
  onStoreFilterChange: (storeId: string) => void;
  /** Paginación controlada desde el padre */
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
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
          <span>Cargando productos...</span>
        </div>
      </td>
    </tr>
  );
}

export function ProductsTable({
  products,
  loading,
  categoryFilter,
  categories,
  onCategoryFilterChange,
  storeFilter,
  stores,
  onStoreFilterChange,
  currentPage,
  totalPages,
  onPageChange,
}: ProductsTableProps) {
  const categoryOptions = [
    { value: '', label: 'Todas' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const storeOptions = [
    { value: '', label: 'Todas' },
    ...stores.map((s) => ({ value: s.id, label: s.name })),
  ];

  const COLS = ['Producto', 'Tienda', 'Categoría', 'Stock', 'Precio'];

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
      <FilterBar icon={<Package />} title="Productos">
        <FilterSelect
          id="products-store-filter"
          label="Tienda"
          value={storeFilter}
          onChange={onStoreFilterChange}
          options={storeOptions}
        />
        <FilterSelect
          id="products-cat-filter"
          label="Categoría"
          value={categoryFilter}
          onChange={onCategoryFilterChange}
          options={categoryOptions}
        />
      </FilterBar>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {COLS.map((col, i) => (
                <th
                  key={col}
                  className={`border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-[var(--color-on-surface-variant)] ${
                    i === COLS.length - 1 ? 'text-right' : ''
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingRow cols={COLS.length} />
            ) : products.length === 0 ? (
              <EmptyRow cols={COLS.length} />
            ) : (
              products.map((product) => {
                const isLowStock = product.stock < 10;
                return (
                  <tr
                    key={product.id}
                    className="border-b border-[var(--color-outline-variant)] last:border-0 hover:bg-[var(--color-surface-container-high)]"
                  >
                    <td className="px-4 py-[11px] font-medium text-[var(--color-on-surface)]">
                      {product.name}
                    </td>
                    <td className="px-4 py-[11px]">
                      <span className="inline-flex items-center rounded-full bg-[#EBF1F8] px-2.5 py-0.5 text-[11px] font-medium text-[#2D5A8A]">
                        {product.storeName}
                      </span>
                    </td>
                    <td className="px-4 py-[11px]">
                      <span className="inline-flex items-center rounded-full bg-[#F1EFE8] px-2.5 py-0.5 text-[11px] font-medium text-[#5F5E5A]">
                        {product.categoryName}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-[11px] ${
                        isLowStock
                          ? 'font-medium text-[#A32D2D]'
                          : 'text-[var(--color-on-surface-variant)]'
                      }`}
                    >
                      {product.stock} uds
                    </td>
                    <td className="px-4 py-[11px] text-right font-medium text-[var(--color-on-surface)]">
                      {formatPrice(product.price)}
                    </td>
                  </tr>
                );
              })
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
