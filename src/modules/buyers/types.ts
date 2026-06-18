export type BuyerStatus = 'ACTIVE' | 'DISABLED';

export interface BuyerSummary {
  totalBuyers: number;
  activeBuyers: number;
  disabledBuyers: number;
  buyersWithAddress: number;
}

export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addressesCount: number;
  status: BuyerStatus;
}

export interface BuyerListResponse {
  items: Buyer[];
  total: number;
}

export interface BuyerDetailInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: BuyerStatus;
}

export interface BuyerAddress {
  id: string;
  street: string;
  city: string;
}

export interface BuyerCartSummary {
  itemsCount: number;
  estimatedValue: number;
}

export interface BuyerCartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface BuyerDetailResponse {
  buyer: BuyerDetailInfo;
  addresses: BuyerAddress[];
  cart: BuyerCartSummary;
  cartItems: BuyerCartItem[];
}
