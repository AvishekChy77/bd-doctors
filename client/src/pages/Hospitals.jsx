import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, Search, Loader2, ArrowRight, Stethoscope } from 'lucide-react';
import PageWrap, { stagger, fadeUp } from '../components/PageWrap';
import { getHospitals } from '../lib/hospitals';

export default function Hospitals() {
  const [hospitals, setHospitals] = useState(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    getHospitals().then(setHospitals);
  }, []);

  const filtered = (hospitals ?? []).filter((h) =>
    `${h.name} ${h.address} ${h.district}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <PageWrap className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Hospitals & <span className="text-gradient">chambers</span>
        </h1>
        <p className="font-bangla mt-2 text-slate-400">হাসপাতাল অনুযায়ী ডাক্তার খুঁজুন</p>
      </div>

      <div className="glass mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full p-2">
        <Search className="ml-3 size-4 shrink-0 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search hospital or district…"
          className="w-full bg-transparent py-2 text-sm font-medium outline-none"
        />
      </div>

      {!hospitals ? (
        <div className="grid place-items-center py-32">
          <Loader2 className="size-8 animate-spin text-brand-500" />
        </div>
      ) : (
        <motion.div
          key={q}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((h) => (
            <motion.div key={h.slug} variants={fadeUp}>
              <Link
                to={`/hospitals/${h.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-slate-200/70 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-xl dark:border-white/10 dark:bg-slate-900"
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-brand-600 transition-transform group-hover:scale-110 dark:text-brand-400">
                    <Building2 className="size-6" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-extrabold leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      {h.name}
                    </h2>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="size-3 shrink-0 text-brand-500" />
                      <span className="truncate">{h.district}</span>
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-xs text-slate-400">{h.address}</p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Stethoscope className="size-3.5" />
                    {h.doctors.length} doctor{h.doctors.length > 1 ? 's' : ''}
                  </span>
                  <ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </PageWrap>
  );
}
