import { auth } from '@clerk/nextjs/server';
import { BuyerSummary, BuyerListResponse, BuyerDetailResponse, BuyerStatus } from '../types';

const BUYER_APP_URL = process.env.BUYER_APP_URL || 'https://proyecto-b-buyer-buildnow.vercel.app';

async function getAuthHeaders() {
  const { getToken } = await auth();
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function getBuyerSummary(): Promise<BuyerSummary> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BUYER_APP_URL}/api/control-plane/buyers/summary`, {
    headers,
    cache: 'no-store', // Always fresh data for dashboard
  });

  if (!response.ok) {
    throw new Error('Failed to fetch buyer summary');
  }

  return response.json();
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

  if (!response.ok) {
    throw new Error('Failed to fetch buyers');
  }

  return response.json();
}

export async function getBuyerById(id: string): Promise<BuyerDetailResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BUYER_APP_URL}/api/control-plane/buyers/${id}`, {
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch buyer with id ${id}`);
  }

  return response.json();
}

export async function updateBuyerStatus(id: string, status: BuyerStatus): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BUYER_APP_URL}/api/control-plane/buyers/${id}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update buyer status for id ${id}`);
  }

  return response.json();
}
