import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Store, Users, Truck, CreditCard, ArrowRight } from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const modules = [
    {
      title: 'Seller',
      description: 'Administración de tiendas y vendedores. Gestiona el estado de las cuentas, productos y pedidos .',
      href: '/seller',
      icon: Store,
      colorClass: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Delivery',
      description: 'Gestión operativa de la red logística. Administra altas y bajas de repartidores y resuelve conflictos de entregas.',
      href: '/delivery',
      icon: Truck,
      colorClass: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Buyers',
      description: 'Moderación y gestión de usuarios compradores. Administra suspensiones y altas de usuarios.',
      href: '/buyers',
      icon: Users,
      colorClass: 'bg-indigo-100 text-indigo-600',
    },
    {
      title: 'Finanzas',
      description: 'Control centralizado de pagos y comisiones. Visualiza estado de transferencias, pagos y liberación de fondos.',
      href: '/finanzas',
      icon: CreditCard,
      colorClass: 'bg-rose-100 text-rose-600',
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="industrial-card rounded-xl p-8 border-l-4 border-l-[var(--color-primary)]">
        <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">
          Panel de Administración Global
        </h1>
        <p className="mt-3 text-[var(--color-on-surface-variant)] max-w-3xl leading-relaxed">
          Bienvenido al Control Plane. Desde este panel los administradores pueden operar sobre todas las plataformas integradas. Aquí podrás gestionar entidades, resolver disputas y moderar usuarios del sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="industrial-card rounded-xl p-6 hover:shadow-md transition-all group flex flex-col h-full hover:border-[var(--color-primary)] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${mod.colorClass}`}>
                <mod.icon className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-[var(--color-outline-variant)] group-hover:text-[var(--color-primary)] transition-colors" />
            </div>
            <h2 className="text-xl font-bold mt-5 text-[var(--color-on-surface)]">
              {mod.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed flex-1">
              {mod.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-8 pb-2 text-center">
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          Los datos mostrados en los paneles se actualizan en tiempo real.
        </p>
      </div>
    </div>
  );
}