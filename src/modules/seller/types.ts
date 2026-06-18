// ─────────────────────────────────────────────
// Enums (mirrors Prisma schema)
// ─────────────────────────────────────────────

export enum StoreStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  SUSPENDED = 'SUSPENDED',
}

export enum Role {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  READY = 'READY',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// ─────────────────────────────────────────────
// Base models
// ─────────────────────────────────────────────

export interface Store {
  id: string;
  name: string;
  description?: string;
  address: string;
  status: StoreStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Seller {
  id: string; // Viene desde Clerk (userId)
  name: string;
  email: string;
  role: Role;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  img?: string;
  name: string;
  price: number;
  stock: number;
  weight: number;
  available: boolean;
  storeId: string;
  categoryId: string;
  /** Relación resuelta */
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

/** Shape plana devuelta por GET /api/admin/products */
export interface ProductItem {
  id: string;
  img?: string;
  storeId: string;
  storeName: string;
  categoryId: string;
  categoryName: string;
  name: string;
  price: number;
  stock: number;
  weight: number;
  available: boolean;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
  /** Relación resuelta */
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  /** ID del comprador en Clerk */
  buyerId: string;
  totalAmount: number;
  totalWeight: number;
  status: OrderStatus;
  deliveryAddress: string;
  storeId: string;
  /** Relación resuelta */
  store: Store;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// UI helpers
// ─────────────────────────────────────────────

/** Humaniza un OrderStatus al español */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING_PAYMENT]: 'Pendiente de pago',
  [OrderStatus.CONFIRMED]: 'Confirmado',
  [OrderStatus.READY]: 'Listo para retirar',
  [OrderStatus.ON_THE_WAY]: 'En camino',
  [OrderStatus.DELIVERED]: 'Entregado',
  [OrderStatus.CANCELLED]: 'Cancelado',
};

/** Humaniza un StoreStatus al español */
export const STORE_STATUS_LABELS: Record<StoreStatus, string> = {
  [StoreStatus.OPEN]: 'Abierta',
  [StoreStatus.CLOSE]: 'Cerrada',
  [StoreStatus.SUSPENDED]: 'Suspendida',
};

/** Vista activa en el dashboard de gestión */
export type ManagementView = 'stores' | 'orders' | 'products';
