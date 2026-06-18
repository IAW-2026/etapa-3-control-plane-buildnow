import { TransactionType } from '../../types';

export function TransactionTypeBadge({ type }: { type: TransactionType }) {
  const labelMap: Record<TransactionType, string> = {
    PAYMENT: 'Payment',
    PAYOUT_DELIVERY: 'Payout Delivery',
    PAYOUT_SELLER: 'Payout Seller',
    COMMISSION: 'Commission'
  };

  const colorMap: Record<TransactionType, string> = {
    PAYMENT: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400',
    PAYOUT_DELIVERY: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400',
    PAYOUT_SELLER: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-400',
    COMMISSION: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorMap[type] || 'bg-gray-100 text-gray-800'
        }`}
    >
      {labelMap[type] || type}
    </span>
  );
}
