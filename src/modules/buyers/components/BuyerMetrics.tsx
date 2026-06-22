import { Users, UserCheck, UserX, MapPin } from 'lucide-react';
import { BuyerSummary } from '../types';

export function BuyerMetrics({ summary }: { summary: BuyerSummary }) {
  const cards = [
    {
      title: 'Total Compradores',
      value: summary.totalBuyers,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Compradores Activos',
      value: summary.activeBuyers,
      icon: UserCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Compradores Deshabilitados',
      value: summary.disabledBuyers,
      icon: UserX,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Con Dirección',
      value: summary.buyersWithAddress,
      icon: MapPin,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {cards.map((card) => (
        <div 
          key={card.title} 
          className="flex items-center gap-4 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bgColor}`}>
            <card.icon className={`h-6 w-6 ${card.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">{card.title}</p>
            <p className="text-2xl font-bold text-[var(--color-on-surface)]">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
