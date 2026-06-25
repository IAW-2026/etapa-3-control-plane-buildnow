"Use client";

import { Users, Activity, Info, PackageCheck } from "lucide-react";

interface Props {
  totalDrivers: number;
  activeDrivers: number;
  completedDeliveries: number;
}

export default function MetricasTab({
  totalDrivers,
  activeDrivers,
  completedDeliveries,
}: Props) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Repartidores</p>
          <p className="text-2xl font-bold text-slate-900">{totalDrivers}</p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 relative group">
            <p className="text-sm font-medium text-slate-500">Activos Ahora</p>
            <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />

            <span className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 rounded bg-slate-800 p-2 text-xs text-white shadow-lg z-10">
              Repartidores entregando algún pedido en este momento (ON_THE_WAY).
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeDrivers}</p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <PackageCheck className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 relative group">
            <p className="text-sm font-medium text-slate-500">Entregas</p>
            <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />

            <span className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 rounded bg-slate-800 p-2 text-xs text-white shadow-lg z-10">
              Total de deliveries que han sido completados con éxito
              (DELIVERED).
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {completedDeliveries}
          </p>
        </div>
      </div>
    </div>
  );
}
