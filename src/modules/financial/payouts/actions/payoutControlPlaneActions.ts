'use server';

import { payoutControlPlaneService } from '../services/payoutControlPlaneService';

export async function getPayoutDetailAction(id: string) {
  try {
    const data = await payoutControlPlaneService.getPayoutDetail(id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
