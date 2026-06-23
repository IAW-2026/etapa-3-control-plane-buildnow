import { ManagementDashboard } from '@/modules/seller/components/ManagementDashboard';

export const metadata = {
  title: 'Gestión — Control Plane',
  description: 'Administración de tiendas, órdenes y productos.',
};

export default function OrdersPage() {
  return <ManagementDashboard />;
}
