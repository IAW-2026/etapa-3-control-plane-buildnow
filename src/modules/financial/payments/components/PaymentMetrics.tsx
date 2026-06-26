import { CreditCard, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { PaymentSummary } from '../../types';
import { FinancialMetrics } from '../../components/FinancialMetrics';

export function PaymentMetrics({ summary }: { summary: PaymentSummary }) {
  const cards = [
    {
      title: 'Pagos totales',
      value: summary.total,
      icon: CreditCard,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Pagos aprobados',
      value: summary.approved,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Pagos pendientes',
      value: summary.pending,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      title: 'Pagos rechazados',
      value: summary.rejected,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];

  return <FinancialMetrics cards={cards} />;
}
