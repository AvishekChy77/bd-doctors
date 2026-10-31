import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

export default function EmptyState({ title, hint }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full grid place-items-center rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/10"
    >
      <div>
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-slate-900/5 dark:bg-white/5">
          <SearchX className="size-7 text-slate-400" />
        </span>
        <h3 className="mt-4 font-bold">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{hint}</p>
      </div>
    </motion.div>
  );
}
