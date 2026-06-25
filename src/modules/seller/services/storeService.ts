import { StoreStatus, type Store } from '@/modules/seller/types';
import { buildHeaders, handleResponse, BASE_URL } from './utils';
// ─────────────────────────────────────────────
// Response shapes
// ─────────────────────────────────────────────

/** Shape devuelta por GET /stores (paginada) */
export interface StoresPage {
  data: Store[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─────────────────────────────────────────────
// Service functions
// ─────────────────────────────────────────────

/**
 * Obtiene la lista paginada de tiendas del seller autenticado.
 * @param token   Token JWT de Clerk obtenido con `useAuth().getToken()`
 * @param page    Página a solicitar (default: 1)
 * @param search  Texto de búsqueda por nombre de tienda (default: '')
 */
export async function getStores(
  token: string,
  page = 1
): Promise<StoresPage> {
  const params = new URLSearchParams({ pageNumber: String(page) });
  const url = `${BASE_URL}/api/stores?${params.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(token),
  });
  return handleResponse<StoresPage>(res);
}

/**
 * Actualiza el estado de una tienda.
 * @param token   Token JWT de Clerk
 * @param id      ID de la tienda
 * @param status  Nuevo estado: OPEN | CLOSE | SUSPENDED
 */
export async function updateStoreStatus(
  token: string,
  id: string,
  status: StoreStatus,
): Promise<Store> {
  const url = `${BASE_URL}/api/stores/${id}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: buildHeaders(token),
    body: JSON.stringify({ status }),
  });
  return handleResponse<Store>(res);
}
