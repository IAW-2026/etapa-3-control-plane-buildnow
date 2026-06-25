import React from 'react';

interface ConfirmStatusModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmStatusModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}: ConfirmStatusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-[var(--color-surface,white)] p-6 shadow-xl border border-[var(--color-outline-variant,#e5e7eb)] dark:bg-zinc-900 dark:border-zinc-800">
        <h3 className="mb-2 text-lg font-semibold text-[var(--color-on-surface,black)] dark:text-white">
          {title}
        </h3>
        <p className="mb-6 text-sm text-[var(--color-on-surface-variant,#4b5563)] dark:text-zinc-400">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-sm font-medium text-[var(--color-on-surface,#374151)] bg-transparent hover:bg-[var(--color-surface-container-high,#f3f4f6)] border border-[var(--color-outline-variant,#d1d5db)] transition-colors dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md px-4 py-2 text-sm font-medium text-white bg-[#1D9E75] hover:bg-[#16805e] transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
