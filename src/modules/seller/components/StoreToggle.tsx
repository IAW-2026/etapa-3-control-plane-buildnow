'use client';

import { StoreStatus } from '@/modules/seller/types';

interface StoreToggleProps {
  status: StoreStatus;
  storeName: string;
  onToggle: () => void;
}

/**
 * Toggle on/off para activar/desactivar una tienda.
 * - OPEN → estado "on" (verde)
 * - CLOSE → estado "off" (gris)
 * - SUSPENDED → deshabilitado (no se puede togglear)
 */
export function StoreToggle({ status, storeName, onToggle }: StoreToggleProps) {
  const isOn = status === StoreStatus.OPEN;
  const isDisabled = status === StoreStatus.SUSPENDED;

  return (
    <div className="flex justify-end">
      <button
        onClick={onToggle}
        disabled={isDisabled}
        aria-label={`${isOn ? 'Desactivar' : 'Activar'} ${storeName}`}
        title={isDisabled ? 'Suspendida — no se puede cambiar manualmente' : undefined}
        className={`relative h-5 w-9 rounded-full border-none transition-colors duration-200 focus:outline-none ${
          isDisabled
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-pointer'
        } ${
          isOn
            ? 'bg-[#1D9E75]'
            : 'bg-[var(--color-outline-variant)]'
        }`}
      >
        <span
          className={`absolute top-[3px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-all duration-200 ${
            isOn ? 'left-[19px]' : 'left-[3px]'
          }`}
        />
      </button>
    </div>
  );
}
