import { auth } from '@clerk/nextjs/server';
import { ApiResponse, PayoutSummary, PayoutListResponse, PayoutDetailResponse, PayoutStatus, RecipientType } from '../../types';

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
    console.error(`[PayoutAPI] ${context} failed — Status: ${response.status}, Body: ${errorBody}`);
    throw new Error(`${context}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getPayoutSummary(): Promise<PayoutSummary> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${PAYMENTS_APP_URL}/api/control-plane/payouts/summary`, {
    headers,
    cache: 'no-store',
  });

  const result = await handleResponse<ApiResponse<PayoutSummary>>(
    response,
    'Failed to fetch payouts'
  );

  return result.data;
}

export async function getPayouts(params: {
  page?: number;
  limit?: number;
  status?: PayoutStatus;
  recipientType?: RecipientType;
  search?: string;
}): Promise<PayoutListResponse> {
  const headers = await getAuthHeaders();
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.status) searchParams.set('status', params.status);
  if (params.recipientType) searchParams.set('recipientType', params.recipientType);
  if (params.search) searchParams.set('search', params.search);

  const url = `${PAYMENTS_APP_URL}/api/control-plane/payouts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(url, {
    headers,
    cache: 'no-store',
  });


  const result = await handleResponse<ApiResponse<PayoutListResponse>>(
    response,
    'Failed to fetch payouts'
  );

  return result.data;
}

export async function getPayoutById(id: string): Promise<PayoutDetailResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${PAYMENTS_APP_URL}/api/control-plane/payouts/${id}`, {
    headers,
    cache: 'no-store',
  });

  const result = await handleResponse<ApiResponse<PayoutDetailResponse>>(
    response,
    'Failed to fetch payouts'
  );

  return result.data;
}
