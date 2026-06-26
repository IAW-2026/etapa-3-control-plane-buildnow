'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { SegmentBar } from '@/modules/seller/components/SegmentBar';
import { StoresTable } from '@/modules/seller/components/StoresTable';
import { OrdersTable } from '@/modules/seller/components/OrdersTable';
import { ProductsTable } from '@/modules/seller/components/ProductsTable';
import { getStores, updateStoreStatus } from '@/modules/seller/services/storeService';
import { getOrders } from '@/modules/seller/services/orderService';
import { getProducts, getCategories, type CategoryItem } from '@/modules/seller/services/productService';
import {
  StoreStatus,
  OrderStatus,
  type ManagementView,
  type Store,
  type ProductItem,
  type Order,
} from '@/modules/seller/types';

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

  // ── Stores: paginación ──
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ── Orders state ──
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // ── Orders: paginación y filtros ──
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [ordersStoreFilter, setOrdersStoreFilter] = useState('');
  const [ordersStatusFilter, setOrdersStatusFilter] = useState('');

  // ── Products state ──
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // ── Products: paginación y filtros ──
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);
  const [productsCatFilter, setProductsCatFilter] = useState('');
  const [productsStoreFilter, setProductsStoreFilter] = useState('');
  const [productsCategories, setProductsCategories] = useState<CategoryItem[]>([]);

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

  // ── Fetch de órdenes ──
  const loadOrders = useCallback(
    async (page: number, storeId: string, status: string) => {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const token = await getToken();
        if (!token) throw new Error('No autenticado');
        const result = await getOrders(
          token,
          page,
          storeId || undefined,
          (status as OrderStatus) || undefined,
        );
        setOrders(result.data);
        setOrdersTotalPages(result.totalPages);
      } catch (err) {
        setOrdersError(err instanceof Error ? err.message : 'Error al cargar las órdenes');
      } finally {
        setOrdersLoading(false);
      }
    },
    [getToken],
  );

  // Cargar órdenes cuando se activa la vista (lazy)
  useEffect(() => {
    if (activeView === 'orders') {
      void loadOrders(ordersPage, ordersStoreFilter, ordersStatusFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView]);

  // ── Fetch de productos ──
  const loadProducts = useCallback(
    async (page: number, categoryId: string, storeId: string) => {
      setProductsLoading(true);
      setProductsError(null);
      try {
        const token = await getToken();
        if (!token) throw new Error('No autenticado');
        const result = await getProducts(
          token,
          page,
          categoryId || undefined,
          storeId || undefined,
        );
        setProducts(result.data);
        setProductsTotalPages(result.totalPages);
      } catch (err) {
        setProductsError(err instanceof Error ? err.message : 'Error al cargar los productos');
      } finally {
        setProductsLoading(false);
      }
    },
    [getToken],
  );

  // Cargar productos y categorías cuando se activa la vista (lazy)
  useEffect(() => {
    if (activeView === 'products') {
      const fetchAll = async () => {
        const token = await getToken();
        if (!token) return;
        await Promise.all([
          loadProducts(productsPage, productsCatFilter, productsStoreFilter),
          getCategories(token).then(setProductsCategories).catch(() => {}),
        ]);
      };
      void fetchAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView]);

  function handleProductsPageChange(page: number) {
    setProductsPage(page);
    void loadProducts(page, productsCatFilter, productsStoreFilter);
  }

  function handleProductsCatFilter(categoryId: string) {
    setProductsCatFilter(categoryId);
    setProductsPage(1);
    void loadProducts(1, categoryId, productsStoreFilter);
  }

  function handleProductsStoreFilter(storeId: string) {
    setProductsStoreFilter(storeId);
    setProductsPage(1);
    void loadProducts(1, productsCatFilter, storeId);
  }

  function handleOrdersPageChange(page: number) {
    setOrdersPage(page);
    void loadOrders(page, ordersStoreFilter, ordersStatusFilter);
  }

  function handleOrdersStoreFilter(storeId: string) {
    setOrdersStoreFilter(storeId);
    setOrdersPage(1);
    void loadOrders(1, storeId, ordersStatusFilter);
  }

  function handleOrdersStatusFilter(status: string) {
    setOrdersStatusFilter(status);
    setOrdersPage(1);
    void loadOrders(1, ordersStoreFilter, status);
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
            updatingStoreId={updatingStoreId}
            onStatusChange={handleStatusChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {activeView === 'orders' && (
        <>
          {ordersError && !ordersLoading && (
            <div className="rounded-xl border border-[#FCEBEB] bg-[#FCEBEB] px-4 py-3 text-[13px] text-[#A32D2D]">
              {ordersError}
              <button
                onClick={() => void loadOrders(ordersPage, ordersStoreFilter, ordersStatusFilter)}
                className="ml-3 underline hover:no-underline"
              >
                Reintentar
              </button>
            </div>
          )}
          <OrdersTable
            orders={orders}
            stores={stores}
            loading={ordersLoading}
            storeFilter={ordersStoreFilter}
            statusFilter={ordersStatusFilter}
            onStoreFilterChange={handleOrdersStoreFilter}
            onStatusFilterChange={handleOrdersStatusFilter}
            currentPage={ordersPage}
            totalPages={ordersTotalPages}
            onPageChange={handleOrdersPageChange}
          />
        </>
      )}
      {activeView === 'products' && (
        <>
          {productsError && !productsLoading && (
            <div className="rounded-xl border border-[#FCEBEB] bg-[#FCEBEB] px-4 py-3 text-[13px] text-[#A32D2D]">
              {productsError}
              <button
                onClick={() => void loadProducts(productsPage, productsCatFilter, productsStoreFilter)}
                className="ml-3 underline hover:no-underline"
              >
                Reintentar
              </button>
            </div>
          )}
          <ProductsTable
            products={products}
            loading={productsLoading}
            categories={productsCategories}
            categoryFilter={productsCatFilter}
            onCategoryFilterChange={handleProductsCatFilter}
            stores={stores}
            storeFilter={productsStoreFilter}
            onStoreFilterChange={handleProductsStoreFilter}
            currentPage={productsPage}
            totalPages={productsTotalPages}
            onPageChange={handleProductsPageChange}
          />
        </>
      )}
    </div>
  );
}
