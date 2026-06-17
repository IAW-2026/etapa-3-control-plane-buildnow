'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { SegmentBar } from '@/modules/seller/components/SegmentBar';
import { StoresTable } from '@/modules/seller/components/StoresTable';
import { OrdersTable } from '@/modules/seller/components/OrdersTable';
import { ProductsTable } from '@/modules/seller/components/ProductsTable';
import { getStores, updateStoreStatus } from '@/modules/seller/services/storeService';
import {
  StoreStatus,
  OrderStatus,
  type ManagementView,
  type Store,
  type Category,
  type Product,
  type Order,
} from '@/modules/seller/types';

// ─────────────────────────────────────────────
// Mock data — Orders & Products (se migran en la siguiente iteración)
// ─────────────────────────────────────────────

const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Electrónica', createdAt: new Date(), updatedAt: new Date() },
  { id: 'c2', name: 'Ropa', createdAt: new Date(), updatedAt: new Date() },
  { id: 'c3', name: 'Hogar', createdAt: new Date(), updatedAt: new Date() },
  { id: 'c4', name: 'Alimentos', createdAt: new Date(), updatedAt: new Date() },
];

const PLACEHOLDER_STORE: Store = {
  id: '',
  name: '',
  address: '',
  status: StoreStatus.CLOSE,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Auriculares BT Pro', price: 12500, stock: 24,
    weight: 0.3, available: true, storeId: 's1', categoryId: 'c1',
    category: MOCK_CATEGORIES[0], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'p2', name: 'Remera Urbana', price: 3200, stock: 86,
    weight: 0.2, available: true, storeId: 's2', categoryId: 'c2',
    category: MOCK_CATEGORIES[1], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'p3', name: 'Lámpara LED 60W', price: 1800, stock: 12,
    weight: 0.4, available: true, storeId: 's3', categoryId: 'c3',
    category: MOCK_CATEGORIES[2], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'p4', name: 'Teclado Mecánico', price: 22000, stock: 8,
    weight: 0.9, available: true, storeId: 's4', categoryId: 'c1',
    category: MOCK_CATEGORIES[0], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'p5', name: 'Granola Premium', price: 980, stock: 150,
    weight: 0.5, available: true, storeId: 's1', categoryId: 'c4',
    category: MOCK_CATEGORIES[3], createdAt: new Date(), updatedAt: new Date(),
  },
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-4821-a1b2', buyerId: 'user_2xPqR9mNkLjT4cBv',
    totalAmount: 3200, totalWeight: 0.6, status: OrderStatus.DELIVERED,
    deliveryAddress: 'Av. Santa Fe 1010, CABA',
    storeId: 's1', store: PLACEHOLDER_STORE, items: [],
    createdAt: new Date('2026-06-12'), updatedAt: new Date('2026-06-12'),
  },
  {
    id: 'ord-4820-c3d4', buyerId: 'user_5hWmX8nQpYrZ2eDw',
    totalAmount: 870, totalWeight: 0.2, status: OrderStatus.PENDING_PAYMENT,
    deliveryAddress: 'Bv. San Juan 200, Córdoba',
    storeId: 's2', store: PLACEHOLDER_STORE, items: [],
    createdAt: new Date('2026-06-12'), updatedAt: new Date('2026-06-12'),
  },
  {
    id: 'ord-4819-e5f6', buyerId: 'user_9kVsL3oMrNuA7bCx',
    totalAmount: 1540, totalWeight: 0.3, status: OrderStatus.DELIVERED,
    deliveryAddress: 'Av. Corrientes 4050, CABA',
    storeId: 's1', store: PLACEHOLDER_STORE, items: [],
    createdAt: new Date('2026-06-11'), updatedAt: new Date('2026-06-11'),
  },
  {
    id: 'ord-4818-g7h8', buyerId: 'user_1tUjK6pFqGsH4iDy',
    totalAmount: 4900, totalWeight: 1.8, status: OrderStatus.CANCELLED,
    deliveryAddress: 'Av. San Martín 1200, Mendoza',
    storeId: 's4', store: PLACEHOLDER_STORE, items: [],
    createdAt: new Date('2026-06-11'), updatedAt: new Date('2026-06-11'),
  },
  {
    id: 'ord-4816-k1l2', buyerId: 'user_7yCoJ5rFtIoQ9gHa',
    totalAmount: 2100, totalWeight: 0.9, status: OrderStatus.ON_THE_WAY,
    deliveryAddress: 'Av. San Martín 3000, Mendoza',
    storeId: 's4', store: PLACEHOLDER_STORE, items: [],
    createdAt: new Date('2026-06-10'), updatedAt: new Date('2026-06-10'),
  },
];

const DEBOUNCE_MS = 400;

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function ManagementDashboard() {
  const { getToken } = useAuth();

  const [activeView, setActiveView] = useState<ManagementView>('stores');

  // ── Stores state ──
  const [stores, setStores] = useState<Store[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [storesError, setStoresError] = useState<string | null>(null);
  const [updatingStoreId, setUpdatingStoreId] = useState<string | null>(null);

  // ── Búsqueda y paginación ──
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ── Fetch de tiendas ──
  const loadStores = useCallback(
    async (page: number) => {
      setStoresLoading(true);
      setStoresError(null);
      try {
        const token = await getToken();
        if (!token) throw new Error('No autenticado');
        const result = await getStores(token, page);
        setStores(result.data);
        setTotalPages(result.totalPages);
      } catch (err) {
        setStoresError(err instanceof Error ? err.message : 'Error al cargar las tiendas');
      } finally {
        setStoresLoading(false);
      }
    },
    [getToken],
  );

  useEffect(() => {
    void loadStores(1);
  }, [loadStores]);

  function handlePageChange(page: number) {
    setCurrentPage(page);
    void loadStores(page);
  }

  // ── Cambio de estado de tienda ──
  async function handleStatusChange(id: string, status: StoreStatus) {
    setUpdatingStoreId(id);
    try {
      const token = await getToken();
      if (!token) throw new Error('No autenticado');
      const updated = await updateStoreStatus(token, id, status);
      setStores((prev) =>
        prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
      );
    } catch (err) {
      console.error('Error al actualizar estado de tienda:', err);
      // TODO: mostrar toast de error
    } finally {
      setUpdatingStoreId(null);
    }
  }

  // Sincronizar órdenes mock con los stores reales cargados
  const ordersWithCurrentStore: Order[] = MOCK_ORDERS.map((order) => ({
    ...order,
    store: stores.find((s) => s.id === order.storeId) ?? order.store,
  }));

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-medium text-[var(--color-on-surface)]">Gestión</h1>
          <p className="mt-0.5 text-[13px] text-[var(--color-on-surface-variant)]">
            Tiendas · Órdenes · Productos
          </p>
        </div>
        <SegmentBar activeView={activeView} onChange={setActiveView} />
      </div>

      {/* Views */}
      {activeView === 'stores' && (
        <>
          {storesError && !storesLoading && (
            <div className="rounded-xl border border-[#FCEBEB] bg-[#FCEBEB] px-4 py-3 text-[13px] text-[#A32D2D]">
              {storesError}
              <button
                onClick={() => void loadStores(currentPage)}
                className="ml-3 underline hover:no-underline"
              >
                Reintentar
              </button>
            </div>
          )}
          <StoresTable
            stores={stores}
            loading={storesLoading}
            orders={ordersWithCurrentStore}
            updatingStoreId={updatingStoreId}
            onStatusChange={handleStatusChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {activeView === 'orders' && (
        <OrdersTable orders={ordersWithCurrentStore} stores={stores} />
      )}
      {activeView === 'products' && (
        <ProductsTable products={MOCK_PRODUCTS} stores={stores} />
      )}
    </div>
  );
}
