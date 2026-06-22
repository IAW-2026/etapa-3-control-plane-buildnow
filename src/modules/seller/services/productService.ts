import { type ProductItem } from '@/modules/seller/types';
import { buildHeaders, handleResponse, BASE_URL } from './utils';

// ─────────────────────────────────────────────
// Response shapes
// ─────────────────────────────────────────────

/** Shape devuelta por GET /api/admin/products (paginada) */
export interface ProductsPage {
  data: ProductItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Shape de cada categoría devuelta por GET /api/categories */
export interface CategoryItem {
  id: string;
  name: string;
}

// ─────────────────────────────────────────────
// Service functions
// ─────────────────────────────────────────────

/**
 * Obtiene todas las categorías disponibles.
 *
 * Contrato esperado: GET /api/categories
 *
 * @param token Token JWT de Clerk obtenido con `useAuth().getToken()`
 */
export async function getCategories(token: string): Promise<CategoryItem[]> {
  const url = `${BASE_URL}/api/categories`;
  const res = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(token),
  });
  return handleResponse<CategoryItem[]>(res);
}

/**
 * Obtiene la lista paginada de productos desde el panel de administración.
 *
 * Contrato esperado: GET /api/admin/products
 * Query params:
 *   - pageNumber  {number}  Página a solicitar (default: 1)
 *   - categoryID  {string}  Filtrar por categoría (opcional)
 *   - storeID     {string}  Filtrar por tienda (opcional)
 *
 * @param token      Token JWT de Clerk obtenido con `useAuth().getToken()`
 * @param page       Página a solicitar (default: 1)
 * @param categoryId Filtro opcional por ID de categoría
 * @param storeId    Filtro opcional por ID de tienda
 */
export async function getProducts(
  token: string,
  page = 1,
  categoryId?: string,
  storeId?: string,
): Promise<ProductsPage> {
  const params = new URLSearchParams({ pageNumber: String(page) });
  if (categoryId) params.set('categoryID', categoryId);
  if (storeId) params.set('storeID', storeId);

  const url = `${BASE_URL}/api/admin/products?${params.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(token),
  });
  return handleResponse<ProductsPage>(res);
}
