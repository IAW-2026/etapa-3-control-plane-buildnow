'use server';

import { revalidatePath } from 'next/cache';
import { buyerControlPlaneService } from '../services/buyerControlPlaneService';
import { BuyerStatus } from '../types';

export async function toggleBuyerStatusAction(id: string, newStatus: BuyerStatus) {
  try {
    await buyerControlPlaneService.changeBuyerStatus(id, newStatus);

    // Revalidamos la ruta principal para que se reflejen los cambios en la tabla y métricas
    revalidatePath('/buyers');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBuyerDetailAction(id: string) {
  try {
    const data = await buyerControlPlaneService.getBuyerDetail(id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}