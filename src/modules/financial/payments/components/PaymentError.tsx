import { AlertTriangle } from 'lucide-react';

export function PaymentError({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/30 dark:bg-red-950/10">
      <AlertTriangle className="h-10 w-10 text-red-500" />
      <h3 className="mt-4 text-lg font-bold text-red-800 dark:text-red-400">Error al cargar datos financieros</h3>
      <p className="mt-2 text-sm text-red-700 dark:text-red-500 max-w-md">
        {message || 'No se pudo establecer conexión con el servicio de pagos. Por favor, intente de nuevo más tarde.'}
      </p>
    </div>
  );
}
