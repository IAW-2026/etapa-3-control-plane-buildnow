export enum VehicleType {
  BICYCLE = "BICYCLE",
  MOTORBIKE = "MOTORBIKE",
  CAR = "CAR",
}
export enum StatusDelivery {
  ASSIGNED = "ASSIGNED",
  ON_THE_WAY = "ON_THE_WAY",
  DELIVERED = "DELIVERED",
}

export interface StateHistory {
  id: string;
  status: StatusDelivery;
  deliveryId: string;
  timestamp: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  delivyUserId: string;
  status: StatusDelivery;
  pickupLocation: string;
  deliveryAddress: string;
  createdAt: string;
  storeName: string;
  totalItems: number;
  totalWeight: number;
  updatedAt: string;
  stateHistories: StateHistory[];
  amount: number;
}

export interface Repartidor {
  id: string;
  clerkUserId: string;
  name: string;
  email: string | null;
  phone: string;
  role: string;
  createdAt: string;
  vehicleType: VehicleType;
  deliveries: Delivery[];
}

export const DELIVERY_STATUS_LABELS: Record<StatusDelivery, string> = {
  [StatusDelivery.ASSIGNED]: "Asignado",
  [StatusDelivery.DELIVERED]: "Entregado",
  [StatusDelivery.ON_THE_WAY]: "En camino",
};
