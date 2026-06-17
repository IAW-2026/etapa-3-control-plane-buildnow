'use client';

import { useState } from 'react';
import { SegmentBar } from '@/modules/seller/components/SegmentBar';
import { StoresTable } from '@/modules/seller/components/StoresTable';
import { OrdersTable } from '@/modules/seller/components/OrdersTable';
import { ProductsTable } from '@/modules/seller/components/ProductsTable';
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
// Mock data
// ─────────────────────────────────────────────

const MOCK_STORES: Store[] = [
  {
    id: 's1',
    name: 'Norte Hub',
    address: 'Av. Corrientes 1250, CABA',
    status: StoreStatus.OPEN,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 's2',
    name: 'Sur Express',
    address: 'Bv. San Juan 540, Córdoba',
    status: StoreStatus.OPEN,
    createdAt: new Date('2025-02-15'),
    updatedAt: new Date('2025-02-15'),
  },
  {
    id: 's3',
    name: 'Centro Store',
    address: 'Pellegrini 980, Rosario',
    status: StoreStatus.CLOSE,
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-01'),
  },
  {
    id: 's4',
    name: 'Oeste Point',
    address: 'Av. San Martín 3400, Mendoza',
    status: StoreStatus.OPEN,
    createdAt: new Date('2025-04-20'),
    updatedAt: new Date('2025-04-20'),
  },
  {
    id: 's5',
    name: 'Litoral Market',
    address: 'Av. Libertador 780, Paraná',
    status: StoreStatus.SUSPENDED,
    createdAt: new Date('2025-05-05'),
    updatedAt: new Date('2025-05-05'),
  },
];

const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Electrónica', createdAt: new Date(), updatedAt: new Date() },
  { id: 'c2', name: 'Ropa', createdAt: new Date(), updatedAt: new Date() },
  { id: 'c3', name: 'Hogar', createdAt: new Date(), updatedAt: new Date() },
  { id: 'c4', name: 'Alimentos', createdAt: new Date(), updatedAt: new Date() },
];

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
  {
    id: 'p6', name: 'Mochila Outdoor', price: 8700, stock: 31,
    weight: 0.8, available: true, storeId: 's4', categoryId: 'c2',
    category: MOCK_CATEGORIES[1], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'p7', name: 'Cafetera Express', price: 41000, stock: 5,
    weight: 2.1, available: true, storeId: 's2', categoryId: 'c3',
    category: MOCK_CATEGORIES[2], createdAt: new Date(), updatedAt: new Date(),
  },
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-4821-a1b2', buyerId: 'user_2xPqR9mNkLjT4cBv',
    totalAmount: 3200, totalWeight: 0.6, status: OrderStatus.DELIVERED,
    deliveryAddress: 'Av. Santa Fe 1010, CABA',
    storeId: 's1', store: MOCK_STORES[0], items: [],
    createdAt: new Date('2026-06-12'), updatedAt: new Date('2026-06-12'),
  },
  {
    id: 'ord-4820-c3d4', buyerId: 'user_5hWmX8nQpYrZ2eDw',
    totalAmount: 870, totalWeight: 0.2, status: OrderStatus.PENDING_PAYMENT,
    deliveryAddress: 'Bv. San Juan 200, Córdoba',
    storeId: 's2', store: MOCK_STORES[1], items: [],
    createdAt: new Date('2026-06-12'), updatedAt: new Date('2026-06-12'),
  },
  {
    id: 'ord-4819-e5f6', buyerId: 'user_9kVsL3oMrNuA7bCx',
    totalAmount: 1540, totalWeight: 0.3, status: OrderStatus.DELIVERED,
    deliveryAddress: 'Av. Corrientes 4050, CABA',
    storeId: 's1', store: MOCK_STORES[0], items: [],
    createdAt: new Date('2026-06-11'), updatedAt: new Date('2026-06-11'),
  },
  {
    id: 'ord-4818-g7h8', buyerId: 'user_1tUjK6pFqGsH4iDy',
    totalAmount: 4900, totalWeight: 1.8, status: OrderStatus.CANCELLED,
    deliveryAddress: 'Av. San Martín 1200, Mendoza',
    storeId: 's4', store: MOCK_STORES[3], items: [],
    createdAt: new Date('2026-06-11'), updatedAt: new Date('2026-06-11'),
  },
  {
    id: 'ord-4817-i9j0', buyerId: 'user_4wBxO2qElHmP8fGz',
    totalAmount: 290, totalWeight: 0.1, status: OrderStatus.DELIVERED,
    deliveryAddress: 'Pellegrini 300, Rosario',
    storeId: 's3', store: MOCK_STORES[2], items: [],
    createdAt: new Date('2026-06-10'), updatedAt: new Date('2026-06-10'),
  },
  {
    id: 'ord-4816-k1l2', buyerId: 'user_7yCoJ5rFtIoQ9gHa',
    totalAmount: 2100, totalWeight: 0.9, status: OrderStatus.ON_THE_WAY,
    deliveryAddress: 'Av. San Martín 3000, Mendoza',
    storeId: 's4', store: MOCK_STORES[3], items: [],
    createdAt: new Date('2026-06-10'), updatedAt: new Date('2026-06-10'),
  },
  {
    id: 'ord-4815-m3n4', buyerId: 'user_3zDpK8sGuJrR6hIb',
    totalAmount: 640, totalWeight: 0.2, status: OrderStatus.CONFIRMED,
    deliveryAddress: 'Bv. San Juan 800, Córdoba',
    storeId: 's2', store: MOCK_STORES[1], items: [],
    createdAt: new Date('2026-06-09'), updatedAt: new Date('2026-06-09'),
  },
  {
    id: 'ord-4814-o5p6', buyerId: 'user_6aEqL1tHvKsS5iJc',
    totalAmount: 22000, totalWeight: 0.9, status: OrderStatus.READY,
    deliveryAddress: 'Av. Colón 500, Mendoza',
    storeId: 's4', store: MOCK_STORES[3], items: [],
    createdAt: new Date('2026-06-08'), updatedAt: new Date('2026-06-08'),
  },
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function ManagementDashboard() {
  const [activeView, setActiveView] = useState<ManagementView>('stores');
  const [stores, setStores] = useState<Store[]>(MOCK_STORES);

  function handleToggleStore(id: string) {
    setStores((prev) =>
      prev.map((store) => {
        if (store.id !== id) return store;
        // Solo togglamos entre OPEN y CLOSE; SUSPENDED no se modifica
        if (store.status === StoreStatus.SUSPENDED) return store;
        return {
          ...store,
          status: store.status === StoreStatus.OPEN ? StoreStatus.CLOSE : StoreStatus.OPEN,
          updatedAt: new Date(),
        };
      })
    );
  }

  // Sincronizar las órdenes con las tiendas actuales para que el store.status se refleje
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
        <StoresTable
          stores={stores}
          orders={ordersWithCurrentStore}
          onToggleStore={handleToggleStore}
        />
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
