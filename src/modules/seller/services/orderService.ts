import { OrderStatus, type Order } from '@/modules/seller/types';
import { buildHeaders, handleResponse, BASE_URL } from './utils';

// ─────────────────────────────────────────────
// Response shapes
// ─────────────────────────────────────────────

/** Shape devuelta por GET /api/admin/orders (paginada) */
export interface OrdersPage {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─────────────────────────────────────────────
// Service functions
// ─────────────────────────────────────────────

/**
 * Obtiene la lista paginada de órdenes (vista admin).
 *
 * Contrato esperado: GET /api/admin/orders
 * Query params:
 *   - pageNumber  {number}        Página a solicitar (default: 1)
 *   - pageSize    {number}        Tamaño de página (default: 10)
 *   - storeId     {string}        Filtrar por tienda (opcional)
 *   - status      {OrderStatus}   Filtrar por estado (opcional)
 *
 * Respuesta:
 * {
 *   data:       Order[],
 *   total:      number,   // total de registros
 *   page:       number,   // página actual
 *   pageSize:   number,
 *   totalPages: number,
 * }
 *
 * @param token     Token JWT de Clerk obtenido con `useAuth().getToken()`
 * @param page      Página a solicitar (default: 1)
 * @param storeId   Filtro opcional por ID de tienda
 * @param status    Filtro opcional por estado de orden
 */
export async function getOrders(
  token: string,
  page = 1,
  storeId?: string,
  status?: OrderStatus | '',
): Promise<OrdersPage> {
  const params = new URLSearchParams({ pageNumber: String(page) });
  if (storeId) params.set('storeId', storeId);
  if (status) params.set('status', status);

  const url = `${BASE_URL}/api/admin/orders?${params.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(token),
  });
  return handleResponse<OrdersPage>(res);
}
