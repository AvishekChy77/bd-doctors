import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import PageWrap, { stagger } from '../components/PageWrap';
import DoctorCard from '../components/DoctorCard';
import FilterPanel from '../components/FilterPanel';
import EmptyState from '../components/EmptyState';
import { getDoctors } from '../lib/api';

export default function Doctors({ savedHook }) {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({
    q: params.get('q') ?? '',
    specialty: params.get('specialty') ?? '',
    district: params.get('district') ?? '',
    gender: '',
    day: '',
    maxFee: '',
    sort: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('local');

  // keep URL shareable
  useEffect(() => {
    const next = {};
    if (filters.q) next.q = filters.q;
    if (filters.specialty) next.specialty = filters.specialty;
    if (filters.district) next.district = filters.district;
    setParams(next, { replace: true });
  }, [filters.q, filters.specialty, filters.district, setParams]);

  // debounced fetch
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      getDoctors(filters).then(({ doctors, source }) => {
        setDoctors(doctors);
        setSource(source);
        setLoading(false);
      });
    }, 250);
    return () => clearTimeout(t);
  }, [filters]);

  const heading = useMemo(() => {
    if (filters.specialty) return `${filters.specialty} specialists`;
    if (filters.q) return `Results for “${filters.q}”`;
    return 'All doctors';
  }, [filters.q, filters.specialty]);

  return (
    <PageWrap className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{heading}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {loading ? 'Searching…' : `${doctors.length} doctor${doctors.length === 1 ? '' : 's'} found`}
          {source === 'local' && ' · showing bundled sample data (API offline)'}
        </p>
      </div>

      <div className="glass mb-6 flex items-center gap-2 rounded-full p-2 lg:hidden">
        <Search className="ml-3 size-4 shrink-0 text-slate-400" />
        <input
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          placeholder="Search doctors…"
          className="w-full bg-transparent py-2 text-sm font-medium outline-none"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <div className="glass hidden items-center gap-2 rounded-full p-2 lg:flex">
            <Search className="ml-3 size-4 shrink-0 text-slate-400" />
            <input
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              placeholder="Search doctors…"
              className="w-full bg-transparent py-2 text-sm font-medium outline-none"
            />
          </div>
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>

        {loading ? (
          <div className="grid place-items-center py-32">
            <Loader2 className="size-8 animate-spin text-brand-500" />
          </div>
        ) : (
          <motion.div
            key={JSON.stringify(filters)}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid content-start gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {doctors.length === 0 ? (
              <EmptyState
                title="No doctors match your filters"
                hint="Try removing a filter or searching a different term."
              />
            ) : (
              doctors.map((d) => (
                <DoctorCard
                  key={d.slug}
                  doctor={d}
                  isSaved={savedHook.isSaved(d.slug)}
                  onToggleSave={savedHook.toggle}
                />
              ))
            )}
          </motion.div>
        )}
      </div>
    </PageWrap>
  );
}
