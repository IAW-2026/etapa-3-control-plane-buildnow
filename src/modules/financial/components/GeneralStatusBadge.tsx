import { GeneralStatus } from '../types';

interface Props {
    status: GeneralStatus;
}

export function GeneralStatusBadge({ status }: Props) {
    const labelMap = {
        APPROVED: 'Approved',
        PENDING: 'Pending',
        REJECTED: 'Rejected',
    };

    const colorMap = {
        APPROVED: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400',
        PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400',
        REJECTED: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorMap[status]
                }`}
        >
            {labelMap[status]}
        </span>
    );
}