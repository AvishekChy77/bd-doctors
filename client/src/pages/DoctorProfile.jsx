import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Star, Bookmark, Phone, Mail, MapPin, BadgeCheck,
  GraduationCap, Languages, Briefcase, Building2, Loader2, Banknote, Send,
} from 'lucide-react';
import PageWrap, { stagger, fadeUp } from '../components/PageWrap';
import ScheduleTable from '../components/ScheduleTable';
import ProfileActions from '../components/ProfileActions';
import Reviews from '../components/Reviews';
import ChamberMap from '../components/ChamberMap';
import { avatarGradient, initials, specialtyMeta, DAYS } from '../lib/constants';
import { getDoctor, requestAppointment } from '../lib/api';

function AppointmentForm({ doctor }) {
  const [form, setForm] = useState({ name: '', phone: '', chamberName: doctor.chambers[0]?.name ?? '', preferredDay: '', note: '' });
  const [status, setStatus] = useState(null); // null | sending | ok | offline
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const res = await requestAppointment({ doctorSlug: doctor.slug, ...form });
    setStatus(res.ok ? 'ok' : 'offline');
  };

  const input =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-slate-900';

  if (status === 'ok')
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center text-sm font-semibold text-emerald-700 dark:text-emerald-300">
        ✅ Request sent! The chamber will call you to confirm your serial.
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input required placeholder="Your name" value={form.name} onChange={set('name')} className={input} />
        <input required placeholder="Phone number" value={form.phone} onChange={set('phone')} className={input} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <select value={form.chamberName} onChange={set('chamberName')} className={input}>
          {doctor.chambers.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select value={form.preferredDay} onChange={set('preferredDay')} className={input}>
          <option value="">Any day</option>
          {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <textarea rows="2" placeholder="Note (optional)" value={form.note} onChange={set('note')} className={input} />
      <button
        disabled={status === 'sending'}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:brightness-110 disabled:opacity-60"
      >
        {status === 'sending' ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        Request appointment
      </button>
      {status === 'offline' && (
        <p className="text-center text-xs font-semibold text-amber-600 dark:text-amber-400">
          Backend offline — please call the chamber directly instead.
        </p>
      )}
    </form>
  );
}

export default function DoctorProfile({ savedHook }) {
  const { slug } = useParams();
  const [doctor, setDoctor] = useState(undefined);

  useEffect(() => {
    setDoctor(undefined);
    getDoctor(slug).then(setDoctor);
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (doctor === undefined)
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-8 animate-spin text-brand-500" />
      </div>
    );

  if (!doctor)
    return (
      <PageWrap className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold">Doctor not found</h1>
        <Link to="/doctors" className="mt-4 inline-block font-bold text-brand-600 hover:underline">
          ← Back to all doctors
        </Link>
      </PageWrap>
    );

  const meta = specialtyMeta(doctor.specialty);
  const Icon = meta.icon;
  const saved = savedHook.isSaved(doctor.slug);

  return (
    <PageWrap className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        to="/doctors"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 transition hover:text-brand-600"
      >
        <ArrowLeft className="size-4" /> All doctors
      </Link>

      {/* ── header card ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-8"
      >
        <div className={`pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-gradient-to-br ${meta.glow} to-transparent blur-3xl`} />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className={`grid size-24 shrink-0 place-items-center rounded-3xl bg-gradient-to-br ${avatarGradient(doctor.slug)} text-3xl font-extrabold text-white shadow-xl`}>
            {initials(doctor.name)}
          </div>

          <div className="min-w-0 flex-1">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${meta.chip}`}>
              <Icon className="size-3.5" /> {doctor.specialty}
            </span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{doctor.name}</h1>
            <p className="font-bangla text-slate-500 dark:text-slate-400">{doctor.nameBn}</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><Briefcase className="size-3.5 text-brand-500" />{doctor.designation}</span>
              <span className="flex items-center gap-1"><Building2 className="size-3.5 text-brand-500" />{doctor.workplace}</span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="size-4 fill-current" /> {doctor.rating}
                <span className="font-medium text-slate-400">({doctor.reviewsCount} reviews)</span>
              </span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">{doctor.experienceYears}+ yrs experience</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                <BadgeCheck className="size-4 text-brand-500" /> BMDC: {doctor.bmdcRegNo}
              </span>
            </div>
            <div className="mt-4">
              <ProfileActions doctor={doctor} />
            </div>
          </div>

          <div className="flex gap-2 sm:flex-col">
            <a
              href={`tel:${doctor.phone.replace(/[^+\d]/g, '')}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:brightness-110"
            >
              <Phone className="size-4" /> Call
            </a>
            <button
              onClick={() => savedHook.toggle(doctor.slug)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                saved
                  ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                  : 'bg-slate-900/5 text-slate-600 hover:bg-slate-900/10 dark:bg-white/10 dark:text-slate-300'
              }`}
            >
              <Bookmark className={`size-4 ${saved ? 'fill-current' : ''}`} />
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </motion.section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* about + qualifications */}
          <motion.section variants={fadeUp} initial="hidden" animate="show" className="rounded-3xl border border-slate-200/70 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
            <h2 className="font-extrabold">About</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{doctor.about}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <GraduationCap className="size-4 text-brand-500" /> Qualifications
                </h3>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {doctor.degrees.map((d) => (
                    <li key={d} className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-700 dark:text-brand-300">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <Languages className="size-4 text-brand-500" /> Languages
                </h3>
                <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {doctor.languages.join(', ')}
                </p>
              </div>
            </div>
          </motion.section>

          {/* chambers */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
            {doctor.chambers.map((c) => (
              <motion.section
                key={c.name}
                variants={fadeUp}
                className="rounded-3xl border border-slate-200/70 bg-white p-6 dark:border-white/10 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold">{c.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="size-3.5 shrink-0 text-brand-500" />
                      {c.address} · {c.room}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <Banknote className="size-3.5" /> ৳{c.fee}
                    </span>
                    <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                      follow-up ৳{c.followUpFee}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <ScheduleTable schedule={c.schedule} />
                </div>
                <div className="mt-4 flex flex-wrap items-start gap-2">
                  <a
                    href={`tel:${c.phone.replace(/[^+\d]/g, '')}`}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-600 dark:bg-white/10 dark:hover:bg-brand-600"
                  >
                    <Phone className="size-3.5" /> {c.phone}
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(`${c.name}, ${c.address}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900/5 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-900/10 dark:bg-white/10 dark:text-slate-300"
                  >
                    <MapPin className="size-3.5" /> Open in Maps ↗
                  </a>
                </div>
                <div className="mt-2">
                  <ChamberMap query={`${c.name}, ${c.address}`} />
                </div>
              </motion.section>
            ))}
          </motion.div>

          <Reviews key={doctor.slug} doctor={doctor} />
        </div>

        {/* sidebar */}
        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-3xl p-6 lg:sticky lg:top-24"
          >
            <h2 className="font-extrabold">Request appointment</h2>
            <p className="mb-4 mt-1 text-xs text-slate-400">The chamber will call back to confirm your serial.</p>
            <AppointmentForm doctor={doctor} />
            <div className="mt-5 space-y-2 border-t border-slate-200/70 pt-4 text-sm dark:border-white/10">
              <a href={`tel:${doctor.phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-2 font-semibold text-slate-600 transition hover:text-brand-600 dark:text-slate-300">
                <Phone className="size-4 text-brand-500" /> {doctor.phone}
              </a>
              <a href={`mailto:${doctor.email}`} className="flex items-center gap-2 font-semibold text-slate-600 transition hover:text-brand-600 dark:text-slate-300">
                <Mail className="size-4 text-brand-500" /> {doctor.email}
              </a>
            </div>
          </motion.section>
        </div>
      </div>
    </PageWrap>
  );
}
