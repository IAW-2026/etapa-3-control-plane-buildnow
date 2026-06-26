// ─────────────────────────────────────────────
// Shared Financial Enums & Types
// ─────────────────────────────────────────────

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type PayoutStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type RecipientType = 'SELLER' | 'DELIVERY';
export type TransactionType = 'PAYMENT' | 'PAYOUT_DELIVERY' | 'PAYOUT_SELLER' | 'COMMISSION';

export type GeneralStatus = PaymentStatus | PayoutStatus | TransactionStatus;


export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ─────────────────────────────────────────────
// Payments Types
// ─────────────────────────────────────────────

export interface PaymentSummary {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface Payment {
  id: string;
  userId: string;
  orderId: string;
  amount: number | string;
  method: string | null;
  status: PaymentStatus;
  mercadopagoId: string | null;
  preferenceId: string | null;
  payerEmail: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface PaymentListResponse {
  items: Payment[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PaymentDetailResponse extends Payment {
  transactions: {
    id: string;
    type: string;
    orderId: string;
    amount: number | string;
    status: string;
    createdAt: string;
  }[];
}

// ─────────────────────────────────────────────
// Payouts Types
// ─────────────────────────────────────────────

export interface PayoutSummary {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface Payout {
  id: string;
  orderId: string;
  recipientId: string | null;
  recipientType: RecipientType;
  amount: number | string;
  status: PayoutStatus;
  createdAt: string;
}

export interface PayoutListResponse {
  items: Payout[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PayoutDetailResponse extends Payout {
  transactions: {
    id: string;
    type: string;
    orderId: string;
    amount: number | string;
    status: string;
    createdAt: string;
  }[];
}

// ─────────────────────────────────────────────
// Transactions Types
// ─────────────────────────────────────────────

export interface Transaction {
  id: string;
  type: TransactionType;
  orderId: string;
  amount: number | string;
  status: TransactionStatus;
  createdAt: string;
  paymentId: string | null;
  payoutId: string | null;
}

export interface TransactionListResponse {
  items: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}
