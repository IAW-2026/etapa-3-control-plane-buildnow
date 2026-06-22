import { auth } from '@clerk/nextjs/server';
import { BuyerSummary, BuyerListResponse, BuyerDetailResponse, BuyerStatus } from '../../financial/types';

const BUYER_APP_URL = process.env.BUYER_APP_URL;

async function getAuthHeaders() {
  const { getToken } = await auth();
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    'User-Agent': 'Control-Plane-Server/1.0', // Bypasses Clerk's dev-browser redirect for S2S calls
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(response: Response, context: string): Promise<T> {
  if (!response.ok) {
    let errorBody = '';
    try {
      errorBody = await response.text();
    } catch { }
    console.error(`[BuyerAPI] ${context} failed — Status: ${response.status}, Body: ${errorBody}`);
    throw new Error(`${context}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getBuyerSummary(): Promise<BuyerSummary> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BUYER_APP_URL}/api/control-plane/buyers/summary`, {
    headers,
    cache: 'no-store',
  });

  return handleResponse<BuyerSummary>(response, 'Failed to fetch buyer summary');
}

export async function getBuyers(params: {
  page?: number;
  limit?: number;
  status?: BuyerStatus;
  search?: string;
}): Promise<BuyerListResponse> {
  const headers = await getAuthHeaders();
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.status) searchParams.set('status', params.status);
  if (params.search) searchParams.set('search', params.search);

  const url = `${BUYER_APP_URL}/api/control-plane/buyers${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(url, {
    headers,
    cache: 'no-store',
  });

  return handleResponse<BuyerListResponse>(response, 'Failed to fetch buyers');
}

export async function getBuyerById(id: string): Promise<BuyerDetailResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BUYER_APP_URL}/api/control-plane/buyers/${id}`, {
    headers,
    cache: 'no-store',
  });

  return handleResponse<BuyerDetailResponse>(response, `Failed to fetch buyer ${id}`);
}

export async function updateBuyerStatus(id: string, status: BuyerStatus): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BUYER_APP_URL}/api/control-plane/buyers/${id}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  });

  return handleResponse<{ success: boolean }>(response, `Failed to update buyer status ${id}`);
}
