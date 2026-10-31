import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import PageWrap, { stagger } from '../components/PageWrap';
import DoctorCard from '../components/DoctorCard';
import { getDoctors } from '../lib/api';

export default function Saved({ savedHook }) {
  const [all, setAll] = useState([]);

  useEffect(() => {
    getDoctors({}).then(({ doctors }) => setAll(doctors));
  }, []);

  const savedDoctors = all.filter((d) => savedHook.saved.includes(d.slug));

  return (
    <PageWrap className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight">
        <Bookmark className="size-7 fill-brand-500 text-brand-500" /> Saved doctors
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Kept privately on this device — nothing is uploaded.
      </p>

      {savedDoctors.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 grid place-items-center rounded-3xl border border-dashed border-slate-300 py-24 text-center dark:border-white/10"
        >
          <div>
            <p className="text-4xl">🔖</p>
            <h2 className="mt-3 font-bold">Nothing saved yet</h2>
            <p className="mt-1 text-sm text-slate-400">
              Tap the bookmark icon on any doctor to keep them here.
            </p>
            <Link
              to="/doctors"
              className="mt-6 inline-block rounded-full bg-gradient-to-r from-brand-600 to-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:brightness-110"
            >
              Browse doctors
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {savedDoctors.map((d) => (
            <DoctorCard
              key={d.slug}
              doctor={d}
              isSaved
              onToggleSave={savedHook.toggle}
            />
          ))}
        </motion.div>
      )}
    </PageWrap>
  );
}
