import { getTransactions } from '../api/transactionApi';
import { TransactionStatus, TransactionType } from '../../types';

export const transactionControlPlaneService = {
  getTransactionsList: async (params: { page?: number; limit?: number; status?: TransactionStatus; type?: TransactionType; search?: string }) => {
    try {
      return await getTransactions(params);
    } catch (error) {
      console.error('Error fetching transactions list:', error);
      throw new Error('No se pudo cargar la lista de transacciones.');
    }
  }
};
