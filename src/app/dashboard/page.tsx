import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { TopNav } from '../../components/top-nav';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <>
      <TopNav subtitle="Panel de administración" />

      <main className="p-6">
        <div className="industrial-card rounded-xl p-6">
          <h2 className="text-2xl font-bold">
            Bienvenido al Control Plane
          </h2>

          <p className="mt-2 text-on-surface-variant">
            Plataforma de administración BuildNow.
          </p>
        </div>
      </main>
    </>
  );
}