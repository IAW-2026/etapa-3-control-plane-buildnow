'use client';

import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BuyerErrorProps {
  message?: string;
}

export function BuyerError({ message }: BuyerErrorProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto max-w-md text-center space-y-6 rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-10 shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">
            Error al cargar Buyers
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            {message || 'No se pudo conectar con el servicio de Buyer App. Por favor, verificá que el servidor esté disponible e intentá nuevamente.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => router.refresh()}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[var(--color-outline-variant)] px-5 py-2.5 text-sm font-medium text-[var(--color-on-surface)] transition-all hover:bg-[var(--color-surface-container-high)] active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
