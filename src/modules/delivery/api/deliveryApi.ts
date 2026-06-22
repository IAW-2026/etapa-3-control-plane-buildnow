import { NextResponse } from "next/server";
import { Delivery, Repartidor, StatusDelivery } from "../types";

const DELIVERY_API_URL = process.env.DELIVERY_API_URL;

export async function getRepartidoresConDeliveries(): Promise<Repartidor[]> {
  try {
    // Construimos la URL completa para la petición
    const response = await fetch(`${DELIVERY_API_URL}/api/admin/repartidores`);
    if (!response.ok) {
      throw new Error(
        `Error al obtener repartidores: ${response.status} ${response.statusText}`,
      );
    }
    const data: Repartidor[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getRepartidoresConDeliveries:", error);
    throw new Error("Error al obtener repartidores");
  }
}

export const getDeliveriesByRepartidor = async (
  userId: string,
): Promise<Delivery[]> => {
  try {
    const response = await fetch(
      `${DELIVERY_API_URL}/api/delivery?userId=${userId}`,
    );
    if (!response.ok) {
      throw new Error(
        `Error al obtener deliveries para el usuario ${userId}: ${response.statusText}`,
      );
    }
    const data: Delivery[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getDeliveriesByRepartidor:", error);
    throw error;
  }
};

export const updateDeliveryStatus = async (
  deliveryId: string,
  status: StatusDelivery,
): Promise<Delivery> => {
  try {
    const response = await fetch(
      `${DELIVERY_API_URL}/api/delivery/${deliveryId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    );
    if (!response.ok) {
      throw new Error(
        `Error al actualizar el estado del delivery ${deliveryId}: ${response.statusText}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error en updateDeliveryStatus:", error);
    throw error;
  }
};
