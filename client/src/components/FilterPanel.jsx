import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { SPECIALTIES, DISTRICTS, DAYS } from '../lib/constants';

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
      {label}
    </span>
    {children}
  </label>
);

const selectCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-slate-900';

export default function FilterPanel({ filters, setFilters }) {
  const set = (key) => (e) =>
    setFilters((f) => ({ ...f, [key]: e.target.value }));

  const reset = () =>
    setFilters({ q: filters.q, specialty: '', district: '', gender: '', day: '', maxFee: '', sort: '' });

  return (
    <aside className="glass space-y-4 rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold">
          <SlidersHorizontal className="size-4 text-brand-500" /> Filters
        </h3>
        <button
          onClick={reset}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 transition hover:text-brand-600"
        >
          <RotateCcw className="size-3" /> Reset
        </button>
      </div>

      <Field label="Specialty">
        <select value={filters.specialty} onChange={set('specialty')} className={selectCls}>
          <option value="">All specialties</option>
          {SPECIALTIES.map((s) => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>
      </Field>

      <Field label="District">
        <select value={filters.district} onChange={set('district')} className={selectCls}>
          <option value="">All districts</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </Field>

      <Field label="Available on">
        <div className="flex flex-wrap gap-1.5">
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() =>
                setFilters((f) => ({ ...f, day: f.day === d ? '' : d }))
              }
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                filters.day === d
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-slate-900/5 text-slate-500 hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Gender">
        <div className="grid grid-cols-2 gap-1.5">
          {['Female', 'Male'].map((g) => (
            <button
              key={g}
              onClick={() =>
                setFilters((f) => ({ ...f, gender: f.gender === g ? '' : g }))
              }
              className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                filters.gender === g
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-slate-900/5 text-slate-500 hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </Field>

      <Field label={`Max consultation fee ${filters.maxFee ? `· ৳${filters.maxFee}` : ''}`}>
        <input
          type="range"
          min="500"
          max="2000"
          step="100"
          value={filters.maxFee || 2000}
          onChange={set('maxFee')}
          className="w-full accent-brand-600"
        />
        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
          <span>৳500</span>
          <span>৳2000+</span>
        </div>
      </Field>

      <Field label="Sort by">
        <select value={filters.sort} onChange={set('sort')} className={selectCls}>
          <option value="">Top rated</option>
          <option value="experience">Most experienced</option>
          <option value="fee-asc">Lowest fee</option>
        </select>
      </Field>
    </aside>
  );
}
