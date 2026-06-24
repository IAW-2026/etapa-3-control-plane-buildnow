import Link from 'next/link';
import { AlertTriangle, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-background)] p-4">
      <div className="industrial-card rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="mx-auto h-20 w-20 bg-[var(--color-surface-container-high)] rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-10 w-10 text-[var(--color-on-surface-variant)]" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-7xl font-black tracking-tight text-[var(--color-on-surface)]">
          404
        </h1>
        
        <h2 className="text-2xl font-bold mt-2 text-[var(--color-on-surface)]">
          Página no encontrada
        </h2>
        
        <p className="mt-4 text-[var(--color-on-surface-variant)] leading-relaxed">
          Lo sentimos, la ruta que estás buscando no existe, ha sido eliminada o nunca fue creada.
        </p>
        
        <Link 
          href="/"
          className="mt-8 flex items-center justify-center gap-2 w-full bg-[var(--color-primary)] hover:bg-[#e65c00] text-white py-3.5 px-4 rounded-xl font-semibold transition-colors"
        >
          <LayoutDashboard className="h-5 w-5" />
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
