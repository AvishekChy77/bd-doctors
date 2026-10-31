import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageWrap, { stagger, fadeUp } from '../components/PageWrap';
import { SPECIALTIES } from '../lib/constants';
import { getSpecialtyCounts } from '../lib/api';

export default function Specialties() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    getSpecialtyCounts().then((list) =>
      setCounts(Object.fromEntries(list.map((s) => [s.name, s.count]))),
    );
  }, []);

  return (
    <PageWrap className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          All <span className="text-gradient">specialties</span>
        </h1>
        <p className="font-bangla mt-2 text-slate-400">আপনার প্রয়োজন অনুযায়ী বিভাগ বেছে নিন</p>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SPECIALTIES.map(({ name, bn, icon: Icon, chip, glow }) => (
          <motion.div key={name} variants={fadeUp}>
            <Link
              to={`/doctors?specialty=${encodeURIComponent(name)}`}
              className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-xl dark:border-white/10 dark:bg-slate-900"
            >
              <div className={`pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br ${glow} to-transparent opacity-0 blur-2xl transition-opacity group-hover:opacity-100`} />
              <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${chip} transition-transform group-hover:scale-110`}>
                <Icon className="size-7" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold">{name}</h2>
                <p className="font-bangla text-sm text-slate-400">{bn}</p>
                <p className="mt-0.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
                  {counts[name] ?? 0} doctor{(counts[name] ?? 0) === 1 ? '' : 's'}
                </p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-500" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </PageWrap>
  );
}
