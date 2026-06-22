import { getBuyerSummary, getBuyers, getBuyerById, updateBuyerStatus } from '../api/buyerApi';
import { BuyerStatus } from '@/modules/buyers/types';

export const buyerControlPlaneService = {
  getSummary: async () => {
    try {
      return await getBuyerSummary();
    } catch (error) {
      console.error('Error fetching buyer summary:', error);
      throw new Error('No se pudieron cargar las métricas de los compradores.');
    }
  },

  getBuyersList: async (params: { page?: number; limit?: number; status?: BuyerStatus; search?: string }) => {
    try {
      return await getBuyers(params);
    } catch (error) {
      console.error('Error fetching buyers list:', error);
      throw new Error('No se pudo cargar la lista de compradores.');
    }
  },

  getBuyerDetail: async (id: string) => {
    try {
      return await getBuyerById(id);
    } catch (error) {
      console.error(`Error fetching buyer details for id ${id}:`, error);
      throw new Error('No se pudieron cargar los detalles del comprador.');
    }
  },

  changeBuyerStatus: async (id: string, status: BuyerStatus) => {
    try {
      return await updateBuyerStatus(id, status);
    } catch (error) {
      console.error(`Error updating buyer status for id ${id} to ${status}:`, error);
      throw new Error('No se pudo actualizar el estado del comprador.');
    }
  }
};
