import { LucideIcon } from 'lucide-react';

export interface MetricCard {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function FinancialMetrics({ cards }: { cards: MetricCard[] }) {
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
