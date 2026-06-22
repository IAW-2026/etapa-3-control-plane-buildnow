'use client';

import { useEffect, useState } from 'react';
import { X, MapPin, ShoppingCart, Loader2 } from 'lucide-react';
import { BuyerDetailResponse } from '../types';
import { getBuyerDetailAction } from '../actions/buyerControlPlaneActions';
import { BuyerStatusBadge } from './BuyerStatusBadge';

interface BuyerDetailDrawerProps {
  buyerId: string | null;
  onClose: () => void;
}

export function BuyerDetailDrawer({ buyerId, onClose }: BuyerDetailDrawerProps) {
  const [data, setData] = useState<BuyerDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!buyerId) {
      setData(null);
      setError(null);
      return;
    }

    let isMounted = true;
    
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      const result = await getBuyerDetailAction(buyerId);
      
      if (isMounted) {
        if (result.success && result.data) {
          setData(result.data as BuyerDetailResponse);
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
  }, [buyerId]);

  if (!buyerId) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[var(--color-surface)] shadow-2xl transition-transform duration-300 transform translate-x-0 overflow-y-auto border-l border-[var(--color-outline-variant)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">Detalle del Comprador</h2>
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
              {/* Buyer Information */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                  Información del Comprador
                </h3>
                <div className="rounded-xl border border-[var(--color-outline-variant)] p-4 space-y-3 bg-[var(--color-surface-container-lowest)]">
                  <div>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">Nombre</p>
                    <p className="font-medium text-[var(--color-on-surface)]">{data.buyer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">Correo</p>
                    <p className="font-medium text-[var(--color-on-surface)]">{data.buyer.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">Teléfono</p>
                    <p className="font-medium text-[var(--color-on-surface)]">{data.buyer.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">Estado</p>
                    <div className="mt-1">
                      <BuyerStatusBadge status={data.buyer.status} />
                    </div>
                  </div>
                </div>
              </section>

              {/* Addresses */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                  Direcciones ({data.addresses.length})
                </h3>
                {data.addresses.length > 0 ? (
                  <div className="space-y-3">
                    {data.addresses.map((address) => (
                      <div key={address.id} className="flex items-start gap-3 rounded-xl border border-[var(--color-outline-variant)] p-4 bg-[var(--color-surface-container-lowest)]">
                        <MapPin className="h-5 w-5 shrink-0 text-[var(--color-primary)] mt-0.5" />
                        <div>
                          <p className="font-medium text-[var(--color-on-surface)]">{address.street}</p>
                          <p className="text-sm text-[var(--color-on-surface-variant)]">{address.city}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-on-surface-variant)]">No hay direcciones registradas.</p>
                )}
              </section>

              {/* Active Cart Summary */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                  Carrito Activo
                </h3>
                <div className="rounded-xl border border-[var(--color-outline-variant)] p-4 bg-gradient-to-br from-[var(--color-primary-container)] to-transparent">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingCart className="h-5 w-5 text-[var(--color-primary)]" />
                    <p className="font-medium text-[var(--color-on-surface)]">Resumen del Carrito</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">Cantidad de Items</p>
                      <p className="text-lg font-bold text-[var(--color-on-surface)]">{data.cart.itemsCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">Valor Estimado</p>
                      <p className="text-lg font-bold text-[var(--color-on-surface)]">
                        ${data.cart.estimatedValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Cart Items */}
              {data.cartItems.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                    Items del Carrito
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-[var(--color-outline-variant)]">
                    <table className="min-w-full divide-y divide-[var(--color-outline-variant)] text-sm text-left">
                      <thead className="bg-[var(--color-surface-container-high)]">
                        <tr>
                          <th className="px-4 py-2 font-medium text-[var(--color-on-surface-variant)]">ID Producto</th>
                          <th className="px-4 py-2 font-medium text-[var(--color-on-surface-variant)] text-center">Cant</th>
                          <th className="px-4 py-2 font-medium text-[var(--color-on-surface-variant)] text-right">Precio</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]">
                        {data.cartItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-[var(--color-surface-container)]">
                            <td className="px-4 py-3 text-[var(--color-on-surface)] truncate max-w-[120px]">{item.productId}</td>
                            <td className="px-4 py-3 text-[var(--color-on-surface)] text-center">{item.quantity}</td>
                            <td className="px-4 py-3 text-[var(--color-on-surface)] text-right">${item.price.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
