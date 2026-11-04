import { HelpCircle } from 'lucide-react';

/**
 * Shown wherever a doctor's info isn't available — a quiet dash with an
 * icon and a native tooltip, instead of made-up placeholder data.
 */
export default function NotPublished({ label = 'Not published yet', className = '' }) {
  return (
    <span
      title={label}
      aria-label={label}
      className={`inline-flex cursor-help items-center gap-1 text-slate-400 dark:text-slate-500 ${className}`}
    >
      <HelpCircle className="size-3.5" />
      <span className="text-xs font-semibold">—</span>
    </span>
  );
}
