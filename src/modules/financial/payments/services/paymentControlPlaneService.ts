import { getPaymentSummary, getPayments, getPaymentById } from '../api/paymentApi';
import { PaymentStatus } from '../../types';

export const paymentControlPlaneService = {
  getSummary: async () => {
    try {
      return await getPaymentSummary();
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      throw new Error('No se pudieron cargar las métricas de pagos.');
    }
  },

  getPaymentsList: async (params: { page?: number; limit?: number; status?: PaymentStatus; search?: string }) => {
    try {
      return await getPayments(params);
    } catch (error) {
      console.error('Error fetching payments list:', error);
      throw new Error('No se pudo cargar la lista de pagos.');
    }
  },

  getPaymentDetail: async (id: string) => {
    try {
      return await getPaymentById(id);
    } catch (error) {
      console.error(`Error fetching payment details for id ${id}:`, error);
      throw new Error('No se pudieron cargar los detalles del pago.');
    }
  }
};
