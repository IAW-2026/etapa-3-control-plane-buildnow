'use client';

import { useEffect, useState } from 'react';
import { X, Coins, Loader2, Calendar } from 'lucide-react';
import { PayoutDetailResponse } from '../../types';
import { getPayoutDetailAction } from '../actions/payoutControlPlaneActions';
import { StatusBadge } from '../../components/StatusBadge';

interface PayoutDetailDrawerProps {
  payoutId: string | null;
  onClose: () => void;
}

export function PayoutDetailDrawer({ payoutId, onClose }: PayoutDetailDrawerProps) {
  const [data, setData] = useState<PayoutDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!payoutId) {
      setData(null);
      setError(null);
      return;
    }

    let isMounted = true;
    
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      const result = await getPayoutDetailAction(payoutId);
      
      if (isMounted) {
        if (result.success && result.data) {
          setData(result.data as PayoutDetailResponse);
        } else {
          setError(result.error || 'Ocurrió un error inesperado');
        }
        setLoading(false);
      }
    };

    fetchDetail();
    
    return () => {
      isMounted = false;
    };
  }, [payoutId]);

  if (!payoutId) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[var(--color-surface)] shadow-2xl transition-transform duration-300 transform translate-x-0 overflow-y-auto border-l border-[var(--color-outline-variant)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">Detalles de Payout</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-8">
          {loading && (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && data && (
            <>
              {/* Payout Summary Header */}
              <div className="flex flex-col items-center justify-center text-center p-6 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 mb-3">
                  <Coins className="h-6 w-6" />
                </div>
                <p className="text-3xl font-extrabold text-[var(--color-on-surface)]">
                  ${Number(data.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </p>
                <div className="mt-2">
                  <StatusBadge status={data.status} />
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-2">ID: {data.id}</p>
              </div>

              {/* Recipient Details */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                  Información de Destinatario
                </h3>
                <div className="rounded-xl border border-[var(--color-outline-variant)] p-4 space-y-3 bg-[var(--color-surface-container-lowest)] text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-on-surface-variant)]">Tipo de Destinatario</span>
                    <span className="font-semibold text-[var(--color-primary)] capitalize">{data.recipientType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-on-surface-variant)]">ID de Destinatario</span>
                    <span className="font-mono font-medium text-[var(--color-on-surface)] truncate max-w-[180px]">{data.recipientId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-on-surface-variant)]">Order ID Relacionada</span>
                    <span className="font-medium text-[var(--color-on-surface)]">{data.orderId}</span>
                  </div>
                </div>
              </section>

              {/* Dates */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                  Registro de Fechas
                </h3>
                <div className="rounded-xl border border-[var(--color-outline-variant)] p-4 space-y-3 bg-[var(--color-surface-container-lowest)] text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-on-surface-variant)] flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Registrado</span>
                    <span className="font-medium text-[var(--color-on-surface)]">
                      {new Date(data.createdAt).toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </section>

              {/* Transactions */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                  Transacciones del Payout ({data.transactions?.length || 0})
                </h3>
                {data.transactions && data.transactions.length > 0 ? (
                  <div className="space-y-2">
                    {data.transactions.map((tx) => (
                      <div key={tx.id} className="rounded-lg border border-[var(--color-outline-variant)] p-3 text-xs bg-[var(--color-surface-container-lowest)] flex justify-between items-center">
                        <div>
                          <p className="font-bold text-[var(--color-on-surface)] capitalize">{tx.type.replace('_', ' ')}</p>
                          <p className="text-[var(--color-on-surface-variant)] mt-0.5">{new Date(tx.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[var(--color-on-surface)]">${Number(tx.amount).toLocaleString('es-AR')}</p>
                          <p className="text-[var(--color-on-surface-variant)] mt-0.5 capitalize">{tx.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-on-surface-variant)]">No hay transacciones asociadas.</p>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}
