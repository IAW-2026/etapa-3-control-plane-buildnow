import { Payment, Payout } from '../../types';
import { ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';

interface FinanceDashboardProps {
  paymentsSummary: { total: number; approved: number; pending: number; rejected: number };
  payoutsSummary: { total: number; approved: number; pending: number; rejected: number };
  recentPayments: Payment[];
  recentPayouts: Payout[];
}

export function FinanceDashboard({
  paymentsSummary,
  payoutsSummary,
  recentPayments = [],
  recentPayouts = [],
}: FinanceDashboardProps) {
  const incidents = recentPayments.filter(
    p => p.status === 'REJECTED'
  );


  return (
    <div className="space-y-6">
      {/* Resumen de Entidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Resumen Pagos */}
        <div className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--color-on-surface)] flex items-center gap-2 mb-4">
            <ArrowUpRight className="h-5 w-5 text-green-500" />
            Flujo de Pagos (Compradores)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--color-surface-container-low)] p-4 rounded-lg">
              <p className="text-xs text-[var(--color-on-surface-variant)]">Aprobados</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{paymentsSummary.approved}</p>
            </div>
            <div className="bg-[var(--color-surface-container-low)] p-4 rounded-lg">
              <p className="text-xs text-[var(--color-on-surface-variant)]">Pendientes</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{paymentsSummary.pending}</p>
            </div>
            <div className="bg-[var(--color-surface-container-low)] p-4 rounded-lg">
              <p className="text-xs text-[var(--color-on-surface-variant)]">Rechazados</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{paymentsSummary.rejected}</p>
            </div>
            <div className="bg-[var(--color-surface-container-low)] p-4 rounded-lg">
              <p className="text-xs text-[var(--color-on-surface-variant)]">Total Registrados</p>
              <p className="text-2xl font-bold text-[var(--color-on-surface)] mt-1">{paymentsSummary.total}</p>
            </div>
          </div>
        </div>

        {/* Resumen Payouts */}
        <div className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--color-on-surface)] flex items-center gap-2 mb-4">
            <ArrowDownLeft className="h-5 w-5 text-indigo-500" />
            Flujo de Payouts (Vendedores / Delivery)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--color-surface-container-low)] p-4 rounded-lg">
              <p className="text-xs text-[var(--color-on-surface-variant)]">Aprobados</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{payoutsSummary.approved}</p>
            </div>
            <div className="bg-[var(--color-surface-container-low)] p-4 rounded-lg">
              <p className="text-xs text-[var(--color-on-surface-variant)]">Pendientes</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{payoutsSummary.pending}</p>
            </div>
            <div className="bg-[var(--color-surface-container-low)] p-4 rounded-lg">
              <p className="text-xs text-[var(--color-on-surface-variant)]">Rechazados</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{payoutsSummary.rejected}</p>
            </div>
            <div className="bg-[var(--color-surface-container-low)] p-4 rounded-lg">
              <p className="text-xs text-[var(--color-on-surface-variant)]">Total Registrados</p>
              <p className="text-2xl font-bold text-[var(--color-on-surface)] mt-1">{payoutsSummary.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bandeja de Incidencias Operativas (Pagos Rechazados Recientes) */}
      <div className="rounded-xl border border-red-200 bg-red-50/20 dark:border-red-900/30 p-6">
        <h2 className="text-lg font-bold text-red-800 dark:text-red-400 flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Alertas de Pagos Rechazados Recientes
        </h2>
        {incidents.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-red-200 bg-[var(--color-surface)]">
            <table className="min-w-full divide-y divide-red-200 text-sm text-left">
              <thead className="bg-red-50/50">
                <tr>
                  <th className="px-4 py-2 font-semibold text-red-800">Payment ID</th>
                  <th className="px-4 py-2 font-semibold text-red-800">Order ID</th>
                  <th className="px-4 py-2 font-semibold text-red-800">Comprador</th>
                  <th className="px-4 py-2 font-semibold text-red-800">Monto</th>
                  <th className="px-4 py-2 font-semibold text-red-800">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100">
                {incidents.slice(0, 5).map(inc => (
                  <tr key={inc.id} className="hover:bg-red-50/20">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-on-surface)]">{inc.id}</td>
                    <td className="px-4 py-3 text-[var(--color-on-surface)]">{inc.orderId}</td>
                    <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{inc.payerEmail || 'N/A'}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-on-surface)]">${Number(inc.amount).toLocaleString('es-AR')}</td>
                    <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">{new Date(inc.createdAt).toLocaleString('es-AR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-[var(--color-on-surface-variant)]">No se registraron pagos rechazados recientemente. ¡La operación está limpia!</p>
        )}
      </div>
    </div>
  );
}
