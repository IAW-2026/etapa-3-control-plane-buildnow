import { auth } from '@clerk/nextjs/server';
import { ApiResponse, TransactionListResponse, TransactionStatus, TransactionType } from '../../types';

const PAYMENTS_APP_URL = process.env.PAYMENTS_APP_URL;

async function getAuthHeaders() {
  const { getToken } = await auth();
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    'User-Agent': 'Control-Plane-Server/1.0',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(response: Response, context: string): Promise<T> {
  if (!response.ok) {
    let errorBody = '';
    try {
      errorBody = await response.text();
    } catch { }
    console.error(`[TransactionAPI] ${context} failed — Status: ${response.status}, Body: ${errorBody}`);
    throw new Error(`${context}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getTransactions(params: {
  page?: number;
  limit?: number;
  status?: TransactionStatus;
  type?: TransactionType;
  search?: string;
}): Promise<TransactionListResponse> {
  const headers = await getAuthHeaders();
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.status) searchParams.set('status', params.status);
  if (params.type) searchParams.set('type', params.type);
  if (params.search) searchParams.set('search', params.search);

  const url = `${PAYMENTS_APP_URL}/api/control-plane/transactions${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(url, {
    headers,
    cache: 'no-store',
  });

  const result = await handleResponse<ApiResponse<TransactionListResponse>>(
    response,
    'Failed to fetch payouts'
  );

  return result.data;
}
