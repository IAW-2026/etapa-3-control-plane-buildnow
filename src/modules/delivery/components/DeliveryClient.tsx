"use client";

import { useState, useMemo } from "react";
import { useEffect } from "react";
import { Repartidor } from "../types";
import { DeliveriesTable, DeliveryColumn } from "./DeliveriesTable";
import { ChevronDown, Search } from "lucide-react";

interface DeliveryClientProps {
  data: Repartidor[];
}

export const DeliveryClient: React.FC<DeliveryClientProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openRepartidores, setOpenRepartidores] = useState<Set<string>>(
    new Set(),
  );

  const toggleRepartidor = (id: string) => {
    setOpenRepartidores((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredRepartidores = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    const mapped = data.map((repartidor) => ({
      repartidor,
      deliveries: repartidor.deliveries.map((d) => ({
        ...d,
        repartidorName: repartidor.name,
        repartidorVehicle: repartidor.vehicleType,
      })),
    }));

    if (!q) return mapped;

    return mapped
      .map((item) => {
        const { repartidor, deliveries } = item;
        const matchesRepartidor = repartidor.name.toLowerCase().includes(q);

        if (matchesRepartidor) return item;

        const matchedDeliveries = deliveries.filter(
          (d) =>
            d.id.toLowerCase().includes(q) ||
            (d.orderId && d.orderId.toLowerCase().includes(q)),
        );

        if (matchedDeliveries.length)
          return { repartidor, deliveries: matchedDeliveries };

        return null;
      })
      .filter(Boolean) as {
      repartidor: (typeof data)[number];
      deliveries: ((typeof data)[number]["deliveries"][number] & {
        repartidorName: string;
        repartidorVehicle: string;
      })[];
    }[];
  }, [data, searchTerm]);

  useEffect(() => {
    const q = searchTerm.trim();
    if (!q) return;
    const ids = filteredRepartidores.map(({ repartidor }) => repartidor.id);
    setOpenRepartidores(new Set(ids));
  }, [filteredRepartidores, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Buscar por repartidor, ID de delivery o pedido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-outline-variant bg-surface-container-high py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
        />
      </div>

      <div className="space-y-3">
        {filteredRepartidores.map(({ repartidor, deliveries }) => {
          return (
            <div
              key={repartidor.id}
              className="overflow-hidden rounded-xl border border-outline-variant bg-surface"
            >
              <button
                onClick={() => toggleRepartidor(repartidor.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-on-surface hover:bg-surface-container-high cursor-pointer"
              >
                <span>
                  {repartidor.name} ({deliveries.length} deliveries)
                </span>
                <ChevronDown
                  className={`h-5 w-5 transform transition-transform ${openRepartidores.has(repartidor.id) ? "rotate-180" : ""}`}
                />
              </button>
              {openRepartidores.has(repartidor.id) && (
                <DeliveriesTable deliveries={deliveries} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
