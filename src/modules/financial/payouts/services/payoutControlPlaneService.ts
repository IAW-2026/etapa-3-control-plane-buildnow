import { getPayoutSummary, getPayouts, getPayoutById } from '../api/payoutApi';
import { PayoutStatus, RecipientType } from '../../types';

export const payoutControlPlaneService = {
  getSummary: async () => {
    try {
      return await getPayoutSummary();
    } catch (error) {
      console.error('Error fetching payout summary:', error);
      throw new Error('No se pudieron cargar las métricas de payouts.');
    }
  },

  getPayoutsList: async (params: { page?: number; limit?: number; status?: PayoutStatus; recipientType?: RecipientType; search?: string }) => {
    try {
      return await getPayouts(params);
    } catch (error) {
      console.error('Error fetching payouts list:', error);
      throw new Error('No se pudo cargar la lista de payouts.');
    }
  },

  getPayoutDetail: async (id: string) => {
    try {
      return await getPayoutById(id);
    } catch (error) {
      console.error(`Error fetching payout details for id ${id}:`, error);
      throw new Error('No se pudieron cargar los detalles del payout.');
    }
  }
};
