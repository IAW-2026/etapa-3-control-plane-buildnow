import { BuyerStatus } from '@/modules/buyers/types';;

export function BuyerStatusBadge({ status }: { status: BuyerStatus }) {
  const isActive = status === 'ACTIVE';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
        isActive
          ? 'bg-[#EAF3DE] text-[#3B6D11]'
          : 'bg-[#F1EFE8] text-[#5F5E5A]'
      }`}
    >
      {isActive ? 'Activo' : 'Deshabilitado'}
    </span>
  );
}
