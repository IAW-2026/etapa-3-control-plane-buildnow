"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { Delivery, StatusDelivery } from "../types";
import { StatusBadge } from "@/modules/seller/components/StatusBadge"; // Reutilizamos el StatusBadge
import { ConfirmStatusModal } from "@/modules/seller/components/ConfirmStatusModal";
import { updateDeliveryStatusAction } from "../actions/deliveryActions";

export type DeliveryColumn = Delivery & {
  repartidorName: string;
  repartidorVehicle: string;
};

interface DeliveriesTableProps {
  deliveries: DeliveryColumn[];
  loading?: boolean;
}

function EmptyRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td
        colSpan={cols}
        className="py-8 text-center text-[13px] text-on-surface-variant"
      >
        No hay deliveries para mostrar.
      </td>
    </tr>
  );
}

export function DeliveriesTable({ deliveries, loading }: DeliveriesTableProps) {
  const router = useRouter();
  const [updatingDeliveryId, setUpdatingDeliveryId] = useState<string | null>(
    null,
  );
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    deliveryId: string;
    newStatus: StatusDelivery | null;
  }>({
    isOpen: false,
    deliveryId: "",
    newStatus: null,
  });

  const handleStatusChange = async (
    deliveryId: string,
    newStatus: StatusDelivery,
  ) => {
    setUpdatingDeliveryId(deliveryId);
    try {
      const result = await updateDeliveryStatusAction(deliveryId, newStatus);
      if (result.success) {
        toast.success("Estado del delivery actualizado.");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "No se pudo actualizar el estado.",
      );
    } finally {
      setUpdatingDeliveryId(null);
    }
  };

  const openConfirmationModal = (
    deliveryId: string,
    newStatus: StatusDelivery,
  ) => {
    setModalState({ isOpen: true, deliveryId, newStatus });
  };

  const onConfirm = () => {
    if (modalState.deliveryId && modalState.newStatus) {
      handleStatusChange(modalState.deliveryId, modalState.newStatus);
    }
    setModalState({ isOpen: false, deliveryId: "", newStatus: null });
  };

  const showHistory = (delivery: DeliveryColumn) => {
    const historyText = delivery.stateHistories
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .map((h) => `${h.status}: ${new Date(h.timestamp).toLocaleString()}`)
      .join("\n");
    alert(
      `Historial del Delivery (ID: ...${delivery.id.slice(-6)}):\n\n${historyText}`,
    );
  };

  return (
    <>
      <div className="bg-(--color-surface)">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {[
                  "ID",
                  "Dirección",
                  "Tienda",
                  "Order",
                  "Estado",
                  "Acciones",
                ].map((col) => (
                  <th
                    key={col}
                    className="border-b border-outline-variant bg-surface-container-high px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-on-surface-variant"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </td>
                </tr>
              ) : deliveries.length === 0 ? (
                <EmptyRow cols={7} />
              ) : (
                deliveries.map((delivery) => (
                  <tr
                    key={delivery.id}
                    className="border-b border-outline-variant last:border-0 hover:bg-surface-container-high"
                  >
                    <td className="px-4 py-2.75 font-mono text-xs text-on-surface-variant">
                      {delivery.id}
                    </td>
                    <td className="px-4 py-2.75 text-on-surface-variant">
                      {delivery.deliveryAddress}
                    </td>
                    <td className="px-4 py-2.75 text-on-surface-variant">
                      {delivery.storeName}
                    </td>
                    <td className="px-4 py-2.75 text-on-surface-variant">
                      {delivery.orderId || "-"}
                    </td>
                    <td className="px-4 py-2.75">
                      <StatusBadge status={delivery.status as any} />
                    </td>
                    <td className="px-4 py-2.75 flex items-center gap-2">
                      <button
                        onClick={() => showHistory(delivery)}
                        className="text-xs hover:underline cursor-pointer"
                      >
                        Historial
                      </button>
                      <select
                        value={delivery.status}
                        onChange={(e) =>
                          openConfirmationModal(
                            delivery.id,
                            e.target.value as StatusDelivery,
                          )
                        }
                        disabled={updatingDeliveryId === delivery.id}
                        className="cursor-pointer rounded-md border border-outline-variant bg-(--color-surface) px-2 py-1 text-xs outline-none focus:border-primary"
                      >
                        <option value={delivery.status} disabled>
                          {delivery.status}
                        </option>
                        {Object.values(StatusDelivery)
                          .filter((s) => s !== delivery.status)
                          .map((s) => (
                            <option key={s} value={s}>
                              Cambiar a {s}
                            </option>
                          ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmStatusModal
        isOpen={modalState.isOpen}
        title="Confirmar cambio de estado"
        message={`¿Seguro que quieres cambiar el estado a "${modalState.newStatus}"?`}
        onConfirm={onConfirm}
        onCancel={() =>
          setModalState({ isOpen: false, deliveryId: "", newStatus: null })
        }
      />
    </>
  );
}
