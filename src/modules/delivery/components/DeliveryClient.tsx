"use client";

import { useState, useMemo } from "react";
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

  const filteredRepartidores = useMemo(
    () =>
      data.filter((repartidor) =>
        repartidor.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [data, searchTerm],
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Buscar repartidor por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-outline-variant bg-surface-container-high py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
        />
      </div>

      <div className="space-y-3">
        {filteredRepartidores.map((repartidor) => {
          const deliveries: DeliveryColumn[] = repartidor.deliveries.map(
            (d) => ({
              ...d,
              repartidorName: repartidor.name,
              repartidorVehicle: repartidor.vehicleType,
            }),
          );

          return (
            <div
              key={repartidor.id}
              className="overflow-hidden rounded-xl border border-outline-variant bg-surface"
            >
              <button
                onClick={() => toggleRepartidor(repartidor.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-on-surface hover:bg-surface-container-high"
              >
                <span>
                  {repartidor.name} ({repartidor.deliveries.length} deliveries)
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
