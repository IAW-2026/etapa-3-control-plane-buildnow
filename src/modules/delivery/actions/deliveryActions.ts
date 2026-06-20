"use server";

import { revalidatePath } from "next/cache";
import { updateDeliveryStatus as updateStatusApi } from "../api/deliveryApi";
import { StatusDelivery } from "../types";

/**
 * Server Action para actualizar el estado de un delivery.
 * @param deliveryId ID del delivery a actualizar.
 * @param newStatus Nuevo estado para el delivery.
 */
export async function updateDeliveryStatusAction(
  deliveryId: string,
  newStatus: StatusDelivery,
) {
  try {
    await updateStatusApi(deliveryId, newStatus);
    revalidatePath("/delivery");
    return { success: true };
  } catch (error) {
    console.error("Error in updateDeliveryStatusAction:", error);
    return {
      success: false,
      error: "No se pudo actualizar el estado del delivery.",
    };
  }
}
