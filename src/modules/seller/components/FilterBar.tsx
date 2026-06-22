'use client';

interface FilterBarProps {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}

export function FilterBar({ icon, title, children }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2.5 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] px-4 py-3">
      <span className="text-[var(--color-on-surface-variant)] [&>svg]:h-[15px] [&>svg]:w-[15px]">
        {icon}
      </span>
      <span className="text-[13px] font-medium text-[var(--color-on-surface)]">{title}</span>
      {/* Spacer */}
      <div className="flex-1" />
      {children}
    </div>
  );
}

// ── Slots reutilizables para usar dentro de FilterBar ──

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function FilterSelect({ id, label, value, onChange, options }: FilterSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="whitespace-nowrap text-[12px] text-[var(--color-on-surface-variant)]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[180px] cursor-pointer overflow-hidden text-ellipsis rounded-md border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-2.5 py-[5px] text-[13px] text-[var(--color-on-surface)] outline-none transition-colors focus:border-[var(--color-primary)]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function FilterInput({ value, onChange, placeholder, ariaLabel }: FilterInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="w-48 max-w-full truncate rounded-md border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-2.5 py-[5px] text-[13px] text-[var(--color-on-surface)] outline-none transition-colors placeholder:text-[var(--color-on-surface-variant)] focus:border-[var(--color-primary)]"
    />
  );
}
