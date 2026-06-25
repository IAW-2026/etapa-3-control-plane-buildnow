import { Suspense } from 'react';
import { paymentControlPlaneService } from '@/modules/financial/payments/services/paymentControlPlaneService';
import { payoutControlPlaneService } from '@/modules/financial/payouts/services/payoutControlPlaneService';
import { transactionControlPlaneService } from '@/modules/financial/transactions/services/transactionControlPlaneService';

import { PaymentMetrics } from '@/modules/financial/payments/components/PaymentMetrics';
import { PaymentsTable } from '@/modules/financial/payments/components/PaymentsTable';
import { PaymentError } from '@/modules/financial/payments/components/PaymentError';

import { PayoutMetrics } from '@/modules/financial/payouts/components/PayoutMetrics';
import { PayoutsTable } from '@/modules/financial/payouts/components/PayoutsTable';

import { TransactionsTable } from '@/modules/financial/transactions/components/TransactionsTable';


import {
  PaymentStatus,
  PayoutStatus,
  RecipientType,
  TransactionStatus,
  TransactionType,
} from '@/modules/financial/types';

import { Loader2 } from 'lucide-react';
import { FinanceDashboard } from '@/modules/financial/payments/components/FinanceDashboard';

interface FinanzasPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FinanzasPage({ searchParams }: FinanzasPageProps) {
  const params = await searchParams;

  const activeTab = typeof params.tab === 'string' ? params.tab : 'dashboard';

  // Paginación y filtros generales
  const page = typeof params.page === 'string' ? Number(params.page) : 1;
  const limit = typeof params.limit === 'string' ? Number(params.limit) : 20;
  const search = typeof params.search === 'string' ? params.search : undefined;

  // Filtrado específico de cada entidad
  const paymentStatus = typeof params.status === 'string' ? (params.status as PaymentStatus) : undefined;
  const payoutStatus = typeof params.status === 'string' ? (params.status as PayoutStatus) : undefined;
  const recipientType = typeof params.recipientType === 'string' ? (params.recipientType as RecipientType) : undefined;
  const transactionStatus = typeof params.status === 'string' ? (params.status as TransactionStatus) : undefined;
  const transactionType = typeof params.type === 'string' ? (params.type as TransactionType) : undefined;

  try {
    // Si la pestaña activa es Dashboard
    if (activeTab === 'dashboard') {
      const [paymentsSum, payoutsSum, paymentsList, payoutsList] = await Promise.all([
        paymentControlPlaneService.getSummary(),
        payoutControlPlaneService.getSummary(),
        paymentControlPlaneService.getPaymentsList({ page: 1, limit: 10 }),
        payoutControlPlaneService.getPayoutsList({ page: 1, limit: 10 })
      ]);

      return (
        <div className="space-y-6">
          {renderHeader('Resumen Financiero', 'Vista general y conciliación de cuentas del marketplace')}
          {renderTabsNav(activeTab)}
          <FinanceDashboard
            paymentsSummary={paymentsSum}
            payoutsSummary={payoutsSum}
            recentPayments={paymentsList.items}
            recentPayouts={payoutsList.items}
          />
        </div>
      );
    }

    // Si la pestaña activa es Payments
    if (activeTab === 'payments') {
      const [summary, paymentsData] = await Promise.all([
        paymentControlPlaneService.getSummary(),
        paymentControlPlaneService.getPaymentsList({ page, limit, search, status: paymentStatus })
      ]);



      return (
        <div className="space-y-6">
          {renderHeader('Gestión de Pagos', 'Listado de cobros integrados con Mercado Pago')}
          {renderTabsNav(activeTab)}
          <Suspense fallback={<Loader />}>
            <PaymentMetrics summary={summary} />
          </Suspense>
          <Suspense fallback={<Loader />}>
            <PaymentsTable initialData={paymentsData} />
          </Suspense>
        </div>
      );
    }

    // Si la pestaña activa es Payouts
    if (activeTab === 'payouts') {
      const [summary, payoutsData] = await Promise.all([
        payoutControlPlaneService.getSummary(),
        payoutControlPlaneService.getPayoutsList({ page, limit, search, status: payoutStatus, recipientType })
      ]);

      return (
        <div className="space-y-6">
          {renderHeader('Gestión de Payouts', 'Listado de distribución de fondos a vendedores y delivery')}
          {renderTabsNav(activeTab)}
          <Suspense fallback={<Loader />}>
            <PayoutMetrics summary={summary} />
          </Suspense>
          <Suspense fallback={<Loader />}>
            <PayoutsTable initialData={payoutsData} />
          </Suspense>
        </div>
      );
    }

    // Si la pestaña activa es Transactions
    if (activeTab === 'transactions') {
      const transactionsData = await transactionControlPlaneService.getTransactionsList({
        page,
        limit,
        search,
        status: transactionStatus,
        type: transactionType
      });

      return (
        <div className="space-y-6">
          {renderHeader('Historial de Transacciones', 'Libro contable y ledger de auditoría financiera')}
          {renderTabsNav(activeTab)}
          <Suspense fallback={<Loader />}>
            <TransactionsTable initialData={transactionsData} />
          </Suspense>
        </div>
      );
    }

  } catch (error: any) {
    return (
      <div className="space-y-6">
        {renderHeader('Módulo Finanzas', 'Administración financiera')}
        {renderTabsNav(activeTab)}
        <PaymentError message={error?.message} />
      </div>
    );
  }

  return null;
}

function renderHeader(title: string, desc: string) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-on-surface)]">{title}</h1>
      <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{desc}</p>
    </div>
  );
}

function renderTabsNav(activeTab: string) {
  const tabs = [
    { id: 'dashboard', label: 'Resumen' },
    { id: 'payments', label: 'Pagos' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'transactions', label: 'Transacciones' },
  ];

  return (
    <div className="flex border-b border-[var(--color-outline-variant)] gap-4">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <a
            key={tab.id}
            href={`/finanzas?tab=${tab.id}`}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all ${isActive
              ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`}
          >
            {tab.label}
          </a>
        );
      })}
    </div>
  );
}

function Loader() {
  return (
    <div className="flex h-32 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
    </div>
  );
}
