import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, CalendarCheck, PhoneCall, UserSearch, ShieldCheck } from 'lucide-react';
import PageWrap, { stagger, fadeUp } from '../components/PageWrap';
import DoctorCard from '../components/DoctorCard';
import Stat from '../components/Stat';
import { SPECIALTIES } from '../lib/constants';
import { getDoctors, getStats } from '../lib/api';

const steps = [
  { icon: UserSearch, title: 'Search', text: 'Find doctors by name, specialty, hospital or district.' },
  { icon: CalendarCheck, title: 'Check schedule', text: 'See every chamber, visiting day and consultation fee.' },
  { icon: PhoneCall, title: 'Call & visit', text: 'One tap to call the chamber and book your serial.' },
];

export default function Home({ savedHook }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDoctors({ sort: 'rating' }).then(({ doctors }) => setFeatured(doctors.slice(0, 3)));
    getStats().then(setStats);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    navigate(q ? `/doctors?q=${encodeURIComponent(q)}` : '/doctors');
  };

  return (
    <PageWrap>
      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 size-96 rounded-full bg-brand-400/20 blur-3xl animate-float" />
          <div className="absolute top-40 -right-32 size-[28rem] rounded-full bg-emerald-400/15 blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-cyan-400/15 blur-3xl animate-float" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-bold text-brand-700 dark:text-brand-300"
          >
            <ShieldCheck className="size-3.5" />
            Trusted doctor directory for Bangladesh
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl"
          >
            Find the <span className="text-gradient">right doctor</span>,<br />
            at the right chamber.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="font-bangla mx-auto mt-5 max-w-xl text-lg text-slate-500 dark:text-slate-400"
          >
            বিশেষজ্ঞ ডাক্তার খুঁজুন — যোগ্যতা, চেম্বার, সময়সূচি ও যোগাযোগ, সব এক জায়গায়।
          </motion.p>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="glass mx-auto mt-9 flex max-w-xl items-center gap-2 rounded-full p-2 shadow-xl shadow-brand-500/10"
          >
            <Search className="ml-3 size-5 shrink-0 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Doctor, specialty, hospital or district…"
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition hover:brightness-110"
            >
              Search <ArrowRight className="size-4" />
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs"
          >
            <span className="font-semibold text-slate-400">Popular:</span>
            {['Cardiology', 'Gynecology & Obstetrics', 'Pediatrics', 'Dermatology'].map((s) => (
              <Link
                key={s}
                to={`/doctors?specialty=${encodeURIComponent(s)}`}
                className="rounded-full bg-slate-900/5 px-3 py-1.5 font-semibold text-slate-500 transition hover:bg-brand-500/15 hover:text-brand-600 dark:bg-white/5 dark:text-slate-400"
              >
                {s}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── Stats ───── */}
      {stats && (
        <section className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="glass grid grid-cols-2 gap-6 rounded-3xl p-8 sm:grid-cols-4">
            <Stat value={stats.doctors} label="Verified Doctors" />
            <Stat value={stats.specialties} label="Specialties" />
            <Stat value={stats.chambers} label="Chambers" />
            <Stat value={stats.districts} label="Districts" />
          </div>
        </section>
      )}

      {/* ───── Specialties ───── */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Browse by specialty</h2>
            <p className="mt-1 text-sm text-slate-400">Pick a department to see its specialists</p>
          </div>
          <Link to="/specialties" className="hidden items-center gap-1 text-sm font-bold text-brand-600 hover:underline sm:flex">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {SPECIALTIES.slice(0, 6).map(({ name, bn, icon: Icon, chip }) => (
            <motion.div key={name} variants={fadeUp}>
              <Link
                to={`/doctors?specialty=${encodeURIComponent(name)}`}
                className="group block rounded-3xl border border-slate-200/70 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
              >
                <span className={`mx-auto grid size-12 place-items-center rounded-2xl ${chip} transition-transform group-hover:scale-110`}>
                  <Icon className="size-6" />
                </span>
                <p className="mt-3 text-sm font-bold leading-tight">{name}</p>
                <p className="font-bangla mt-0.5 text-xs text-slate-400">{bn}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───── Featured doctors ───── */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Top-rated doctors</h2>
            <p className="mt-1 text-sm text-slate-400">Highest patient ratings this month</p>
          </div>
          <Link to="/doctors" className="hidden items-center gap-1 text-sm font-bold text-brand-600 hover:underline sm:flex">
            See all doctors <ArrowRight className="size-4" />
          </Link>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((d) => (
            <DoctorCard
              key={d.slug}
              doctor={d}
              isSaved={savedHook.isSaved(d.slug)}
              onToggleSave={savedHook.toggle}
            />
          ))}
        </motion.div>
      </section>

      {/* ───── How it works ───── */}
      <section className="mx-auto mt-24 max-w-5xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
          Book a visit in <span className="text-gradient">3 simple steps</span>
        </h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-10 grid gap-5 sm:grid-cols-3"
        >
          {steps.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="relative rounded-3xl border border-slate-200/70 bg-white p-6 dark:border-white/10 dark:bg-slate-900"
            >
              <span className="absolute top-5 right-5 text-4xl font-extrabold text-slate-100 dark:text-white/5">
                {i + 1}
              </span>
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───── CTA ───── */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-600 via-emerald-600 to-cyan-600 px-6 py-16 text-center text-white"
        >
          <div className="pointer-events-none absolute -top-20 left-1/4 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 size-72 rounded-full bg-white/10 blur-3xl" />
          <h2 className="text-3xl font-extrabold sm:text-4xl">Feeling unwell? Don't wait.</h2>
          <p className="font-bangla mx-auto mt-3 max-w-md text-emerald-50">
            আজই আপনার প্রয়োজনীয় বিশেষজ্ঞের সাথে যোগাযোগ করুন।
          </p>
          <Link
            to="/doctors"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-brand-700 shadow-xl transition hover:scale-105"
          >
            Find a doctor now <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </section>
    </PageWrap>
  );
}
