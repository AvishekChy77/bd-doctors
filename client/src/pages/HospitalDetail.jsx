import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, MapPin, Loader2 } from 'lucide-react';
import PageWrap, { stagger } from '../components/PageWrap';
import DoctorCard from '../components/DoctorCard';
import ChamberMap from '../components/ChamberMap';
import { getHospital } from '../lib/hospitals';

export default function HospitalDetail({ savedHook }) {
  const { slug } = useParams();
  const [hospital, setHospital] = useState(undefined);

  useEffect(() => {
    setHospital(undefined);
    getHospital(slug).then(setHospital);
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (hospital === undefined)
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-8 animate-spin text-brand-500" />
      </div>
    );

  if (!hospital)
    return (
      <PageWrap className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold">Hospital not found</h1>
        <Link to="/hospitals" className="mt-4 inline-block font-bold text-brand-600 hover:underline">
          ← All hospitals
        </Link>
      </PageWrap>
    );

  return (
    <PageWrap className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        to="/hospitals"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 transition hover:text-brand-600"
      >
        <ArrowLeft className="size-4" /> All hospitals
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass flex flex-col gap-4 rounded-[2rem] p-6 sm:flex-row sm:items-center sm:p-8"
      >
        <span className="grid size-16 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-emerald-600 text-white shadow-xl">
          <Building2 className="size-8" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{hospital.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="size-4 shrink-0 text-brand-500" />
            {hospital.address} · {hospital.district}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {hospital.specialties.map((s) => (
              <Link
                key={s}
                to={`/doctors?specialty=${encodeURIComponent(s)}`}
                className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-700 transition hover:bg-brand-500/20 dark:text-brand-300"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(`${hospital.name}, ${hospital.address}`)}`}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-brand-600 dark:bg-white/10 dark:hover:bg-brand-600"
        >
          Get directions ↗
        </a>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6"
      >
        <ChamberMap query={`${hospital.name}, ${hospital.address}`} open />
      </motion.div>

      <h2 className="mt-10 mb-6 text-xl font-extrabold">
        {hospital.doctors.length} doctor{hospital.doctors.length > 1 ? 's' : ''} at this hospital
      </h2>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {hospital.doctors.map((d) => (
          <DoctorCard
            key={d.slug}
            doctor={d}
            isSaved={savedHook.isSaved(d.slug)}
            onToggleSave={savedHook.toggle}
          />
        ))}
      </motion.div>
    </PageWrap>
  );
}
