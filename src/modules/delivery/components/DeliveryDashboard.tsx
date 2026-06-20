// Este es ahora un Componente de Servidor (RSC)
import { getRepartidoresConDeliveries } from "../api/deliveryApi";
import { DeliveryClient } from "./DeliveryClient";

export default async function DeliveryDashboard() {
  const repartidores = await getRepartidoresConDeliveries();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">
          Deliveries
        </h1>
        <p className="text-sm text-on-surface-variant">
          Panel de control para seguimiento y actualización de estados de envío.
        </p>
        <DeliveryClient data={repartidores} />
      </div>
    </div>
  );
}
