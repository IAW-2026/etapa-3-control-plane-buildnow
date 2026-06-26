import { Suspense } from 'react';
import { buyerControlPlaneService } from '@/modules/buyers/services/buyerControlPlaneService';
import { BuyerMetrics } from '@/modules/buyers/components/BuyerMetrics';
import { BuyersTable } from '@/modules/buyers/components/BuyersTable';
import { BuyerError } from '@/modules/buyers/components/BuyerError';
import { BuyerStatus } from '@/modules/buyers/types';
import { Loader2 } from 'lucide-react';

interface BuyersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  // Await searchParams (Next.js 15+ requirement)
  const params = await searchParams;
  
  const page = typeof params.page === 'string' ? Number(params.page) : 1;
  const limit = typeof params.limit === 'string' ? Number(params.limit) : 20;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const status = typeof params.status === 'string' ? (params.status as BuyerStatus) : undefined;

  let summary;
  let buyersData;

  try {
    [summary, buyersData] = await Promise.all([
      buyerControlPlaneService.getSummary(),
      buyerControlPlaneService.getBuyersList({ page, limit, search, status }),
    ]);
  } catch (error: any) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-on-surface)]">Compradores</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            Administración de compradores
          </p>
        </div>
        <BuyerError message={error?.message} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-on-surface)]">Compradores</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Administración de compradores
        </p>
      </div>

      <Suspense fallback={
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
        </div>
      }>
        <BuyerMetrics summary={summary} />
      </Suspense>

      <Suspense fallback={
        <div className="flex h-64 items-center justify-center rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
        </div>
      }>
        <BuyersTable initialData={buyersData} />
      </Suspense>
    </div>
  );
}
