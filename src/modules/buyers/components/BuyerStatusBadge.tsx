import { BuyerStatus } from '../types';

export function BuyerStatusBadge({ status }: { status: BuyerStatus }) {
  const isActive = status === 'ACTIVE';
  
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isActive
          ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400'
          : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
      }`}
    >
      {isActive ? 'Active' : 'Disabled'}
    </span>
  );
}
