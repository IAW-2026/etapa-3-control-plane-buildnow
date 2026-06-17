'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Máximo de botones de página numéricos visibles (excluyendo ← →). Default: 5 */
  maxVisible?: number;
}

/**
 * Barra de paginación reutilizable.
 * No se renderiza si totalPages <= 1.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // ── Calcular rango de páginas visibles ──
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  // Ajustar si nos quedamos cortos al final
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const btnBase =
    'flex h-7 min-w-[28px] items-center justify-center rounded-md px-2 text-[12px] font-medium transition-colors duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40';
  const btnNav = `${btnBase} border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]`;
  const btnPage = (active: boolean) =>
    active
      ? `${btnBase} bg-[#1D9E75] text-white`
      : `${btnBase} text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]`;

  return (
    <div className="flex items-center justify-end gap-1 border-t border-[var(--color-outline-variant)] px-4 py-3">
      {/* Anterior */}
      <button
        className={btnNav}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canPrev}
        aria-label="Página anterior"
      >
        <ChevronLeft size={14} />
      </button>

      {/* Ellipsis izquierda */}
      {start > 1 && (
        <>
          <button className={btnPage(false)} onClick={() => onPageChange(1)}>
            1
          </button>
          {start > 2 && (
            <span className="px-1 text-[12px] text-[var(--color-on-surface-variant)]">…</span>
          )}
        </>
      )}

      {/* Páginas centrales */}
      {pages.map((p) => (
        <button
          key={p}
          className={btnPage(p === currentPage)}
          onClick={() => onPageChange(p)}
          aria-current={p === currentPage ? 'page' : undefined}
          aria-label={`Página ${p}`}
        >
          {p}
        </button>
      ))}

      {/* Ellipsis derecha */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-[12px] text-[var(--color-on-surface-variant)]">…</span>
          )}
          <button className={btnPage(false)} onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      {/* Siguiente */}
      <button
        className={btnNav}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canNext}
        aria-label="Página siguiente"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
