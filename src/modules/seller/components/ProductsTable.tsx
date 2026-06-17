'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import { FilterBar, FilterSelect } from '@/modules/seller/components/FilterBar';
import type { Product, Store } from '@/modules/seller/types';

interface ProductsTableProps {
  products: Product[];
  stores: Store[];
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

export function ProductsTable({ products, stores }: ProductsTableProps) {
  const [storeFilter, setStoreFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const storeOptions = [
    { value: '', label: 'Todas' },
    ...stores.map((s) => ({ value: s.id, label: s.name })),
  ];

  // Deriva categorías únicas desde los productos
  const categoryOptions = [
    { value: '', label: 'Todas' },
    ...Array.from(new Set(products.map((p) => p.category.name))).map((name) => ({
      value: name,
      label: name,
    })),
  ];

  const filtered = products.filter((p) => {
    const matchesStore = !storeFilter || p.storeId === storeFilter;
    const matchesCat = !catFilter || p.category.name === catFilter;
    return matchesStore && matchesCat;
  });

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
      <FilterBar icon={<Package />} title="Productos">
        <FilterSelect
          id="products-store-filter"
          label="Tienda"
          value={storeFilter}
          onChange={setStoreFilter}
          options={storeOptions}
        />
        <FilterSelect
          id="products-cat-filter"
          label="Categoría"
          value={catFilter}
          onChange={setCatFilter}
          options={categoryOptions}
        />
      </FilterBar>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {['Producto', 'Categoría', 'Tienda', 'Stock', 'Precio'].map((col, i) => (
                <th
                  key={col}
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
              filtered.map((product) => {
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
                      <span className="inline-flex items-center rounded-full bg-[#F1EFE8] px-2.5 py-0.5 text-[11px] font-medium text-[#5F5E5A]">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-[11px] text-[var(--color-on-surface-variant)]">
                      {stores.find((s) => s.id === product.storeId)?.name ?? '—'}
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
    </div>
  );
}
