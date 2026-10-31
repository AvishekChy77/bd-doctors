import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, ChevronDown } from 'lucide-react';

/**
 * Lazy, collapsible Google Maps embed (no API key required).
 * The iframe only mounts after the user expands it, so profiles with
 * several chambers don't load multiple maps up front.
 */
export default function ChamberMap({ query, open: openByDefault = false }) {
  const [open, setOpen] = useState(openByDefault);

  return (
    <div className="print:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-xl bg-slate-900/5 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-900/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15"
      >
        <Map className="size-3.5" />
        {open ? 'Hide map' : 'Show on map'}
        <ChevronDown className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-white/10">
              <iframe
                title={`Map of ${query}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
