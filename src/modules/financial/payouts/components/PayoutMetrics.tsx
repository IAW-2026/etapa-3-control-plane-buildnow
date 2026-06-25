import { Coins, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { PayoutSummary } from '../../types';
import { FinancialMetrics } from '../../components/FinancialMetrics';

export function PayoutMetrics({ summary }: { summary: PayoutSummary }) {
  const cards = [
    {
      title: 'Payouts totales',
      value: summary.total,
      icon: Coins,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    },
    {
      title: 'Payouts aprobados',
      value: summary.approved,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Payouts pendientes',
      value: summary.pending,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      title: 'Payouts rechazados',
      value: summary.rejected,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];

  return <FinancialMetrics cards={cards} />;
}
