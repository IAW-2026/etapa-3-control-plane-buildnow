'use client';

import { useClerk } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Store, ShoppingCart,
  Truck, CreditCard, AlertTriangle, Settings,
  FileSearch, Server, LogOut, ShieldCheck
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Seller', href: '/seller', icon: Store },
  { label: 'Delivery', href: '/delivery', icon: Truck }
];

interface SideNavProps {
  userName?: string;
  userEmail?: string;
}

export function SideNav({ userName = 'Admin User', userEmail = '' }: SideNavProps) {
  const { signOut } = useClerk();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-[var(--color-outline-variant)] bg-[var(--color-surface)]">

      <div className="flex items-center gap-3 border-b border-[var(--color-outline-variant)] px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)]">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--color-primary)]">Control Center</p>
          <p className="text-xs text-[var(--color-on-surface-variant)]">Global Logistics</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3">
        {navItems.map(({ label, href, icon: Icon }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${pathname === href
              ? 'bg-[var(--color-primary)] text-white'
              : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-on-surface)]'
              }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2.5 border-t border-[var(--color-outline-variant)] px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-medium text-white">
          {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-[var(--color-on-surface)]">{userName}</p>
          <p className="truncate text-xs text-[var(--color-on-surface-variant)]">{userEmail}</p>
        </div>
        <button
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
          className="shrink-0 rounded p-1 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-on-surface)]"
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}