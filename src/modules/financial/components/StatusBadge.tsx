import { GeneralStatus } from '../types';

export function StatusBadge({ status }: { status: GeneralStatus }) {
  const labelMap: Record<GeneralStatus, string> = {
    APPROVED: 'Approved',
    PENDING: 'Pending',
    REJECTED: 'Rejected'
  };

  const colorMap: Record<GeneralStatus, string> = {
    APPROVED: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400',
    PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorMap[status] || 'bg-gray-100 text-gray-800'
        }`}
    >
      {labelMap[status] || status}
    </span>
  );
}
