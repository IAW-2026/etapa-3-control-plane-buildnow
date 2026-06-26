"use client";

import { useState, useMemo } from "react";
import { useEffect } from "react";
import { Repartidor } from "../types";
import { DeliveriesTable } from "./DeliveriesTable";
import { Search } from "lucide-react";
import MetricasTab from "./MetricasTab";

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

  const totalDrivers = filteredRepartidores.length;

  const activeDrivers = filteredRepartidores.filter((driver) =>
    driver.deliveries.some((del) => del.status === "ON_THE_WAY"),
  ).length;

  const completedDeliveries = filteredRepartidores
    .flatMap((d) => d.deliveries)
    .filter((del) => del.status === "DELIVERED").length;

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

      <MetricasTab
        totalDrivers={totalDrivers}
        activeDrivers={activeDrivers}
        completedDeliveries={completedDeliveries}
      />

      <div className="space-y-3">
        {filteredRepartidores.map(({ repartidor, deliveries }) => {
          const isDriverActive = deliveries.some(
            (del) => del.status === "ON_THE_WAY",
          );

          return (
            <div
              key={repartidor.id}
              className="overflow-hidden rounded-xl border border-outline-variant bg-surface"
            >
              <div>
                <div className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-on-surface">
                  <span>
                    {repartidor.name} ({deliveries.length} deliveries)
                  </span>

                  {isDriverActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 border border-green-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 border border-slate-200">
                      Inactivo
                    </span>
                  )}
                </div>

                <DeliveriesTable deliveries={deliveries} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
