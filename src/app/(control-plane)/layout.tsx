import { SideNav } from '@/components/side-nav';

export default function ControlPlaneLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
