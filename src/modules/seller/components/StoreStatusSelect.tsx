'use client';

import { useState } from 'react';
import { StoreStatus, STORE_STATUS_LABELS } from '@/modules/seller/types';
import { ConfirmStatusModal } from './ConfirmStatusModal';

interface StoreStatusSelectProps {
  status: StoreStatus;
  storeName: string;
  onStatusChange: (status: StoreStatus) => void;
  /** Deshabilita el selector mientras se procesa la petición */
  loading?: boolean;
}

const OPTIONS: { value: StoreStatus; label: string }[] = [
  { value: StoreStatus.OPEN, label: STORE_STATUS_LABELS[StoreStatus.OPEN] },
  { value: StoreStatus.CLOSE, label: STORE_STATUS_LABELS[StoreStatus.CLOSE] },
  { value: StoreStatus.SUSPENDED, label: STORE_STATUS_LABELS[StoreStatus.SUSPENDED] },
];

const ACTIVE_CLASSES: Record<StoreStatus, string> = {
  [StoreStatus.OPEN]: 'bg-[#1D9E75] text-white border-[#1D9E75]',
  [StoreStatus.CLOSE]: 'bg-[var(--color-outline-variant)] text-[var(--color-on-surface)] border-[var(--color-outline-variant)]',
  [StoreStatus.SUSPENDED]: 'bg-[#A32D2D] text-white border-[#A32D2D]',
};

const IDLE_CLASSES =
  'bg-transparent text-[var(--color-on-surface-variant)] border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-high)]';

export function StoreStatusSelect({
  status,
  storeName,
  onStatusChange,
  loading = false,
}: StoreStatusSelectProps) {
  const [pendingStatus, setPendingStatus] = useState<StoreStatus | null>(null);

  const handleConfirm = () => {
    if (pendingStatus) {
      onStatusChange(pendingStatus);
    }
    setPendingStatus(null);
  };

  const handleCancel = () => {
    setPendingStatus(null);
  };

  return (
    <>
      <div
        className="flex items-center justify-end gap-1"
        role="group"
        aria-label={`Estado de ${storeName}`}
      >
        {OPTIONS.map(({ value, label }) => {
          const isActive = status === value;
          return (
            <button
              key={value}
              type="button"
              disabled={loading || isActive}
              onClick={() => setPendingStatus(value)}
              aria-pressed={isActive}
              aria-label={`Cambiar a ${label}`}
              className={`
                rounded-full border px-2.5 py-0.5 text-[11px] font-medium
                transition-colors duration-150 focus:outline-none
                disabled:cursor-not-allowed
                ${isActive ? ACTIVE_CLASSES[value] : IDLE_CLASSES}
                ${loading ? 'opacity-50' : ''}
              `}
            >
              {label}
            </button>
          );
        })}
      </div>

      <ConfirmStatusModal
        isOpen={pendingStatus !== null}
        title="Confirmar cambio de estado"
        message={`¿Estás seguro que deseas cambiar el estado de la tienda "${storeName}" a ${pendingStatus ? STORE_STATUS_LABELS[pendingStatus] : ''
          }?`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
