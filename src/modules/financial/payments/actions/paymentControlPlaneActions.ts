'use server';

import { paymentControlPlaneService } from '../services/paymentControlPlaneService';

export async function getPaymentDetailAction(id: string) {
  try {
    const data = await paymentControlPlaneService.getPaymentDetail(id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
