import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Loader2, Send, BadgeCheck, Globe2, CalendarClock } from 'lucide-react';
import PageWrap from '../components/PageWrap';
import { SPECIALTIES, DISTRICTS } from '../lib/constants';
import { joinAsDoctor } from '../lib/api';

const perks = [
  { icon: Globe2, title: 'Digital presence', text: 'A verified public profile patients can find and share.' },
  { icon: CalendarClock, title: 'Chamber schedule', text: 'Your visiting hours and fees, always up to date.' },
  { icon: BadgeCheck, title: 'BMDC verified badge', text: 'Build trust with a verified registration badge.' },
];

const input =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-slate-900';

export default function Join() {
  const [form, setForm] = useState({
    name: '', bmdcRegNo: '', specialty: '', phone: '', email: '',
    degrees: '', district: '', chamberInfo: '', message: '',
  });
  const [status, setStatus] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const res = await joinAsDoctor(form);
    setStatus(res.ok ? 'ok' : 'offline');
  };

  return (
    <PageWrap className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-bold text-brand-700 dark:text-brand-300"
          >
            <UserPlus className="size-3.5" /> Are you a doctor?
          </motion.span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Join <span className="text-gradient">ShasthoSheba</span> as a listed doctor
          </h1>
          <p className="font-bangla mt-3 text-slate-500 dark:text-slate-400">
            বিনামূল্যে আপনার প্রোফাইল তালিকাভুক্ত করুন এবং আরও রোগীর কাছে পৌঁছান।
          </p>

          <div className="mt-8 space-y-4">
            {perks.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-white/10 dark:bg-slate-900"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold">{title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-[2rem] p-6 sm:p-8"
        >
          {status === 'ok' ? (
            <div className="grid min-h-72 place-items-center text-center">
              <div>
                <p className="text-5xl">🎉</p>
                <h2 className="mt-4 text-xl font-extrabold">Application received!</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Our team will verify your BMDC registration and contact you within 2–3 working days.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <h2 className="text-lg font-extrabold">Application form</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required placeholder="Full name *" value={form.name} onChange={set('name')} className={input} />
                <input required placeholder="BMDC registration no. *" value={form.bmdcRegNo} onChange={set('bmdcRegNo')} className={input} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select required value={form.specialty} onChange={set('specialty')} className={input}>
                  <option value="">Specialty *</option>
                  {SPECIALTIES.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
                <select required value={form.district} onChange={set('district')} className={input}>
                  <option value="">District *</option>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required placeholder="Phone *" value={form.phone} onChange={set('phone')} className={input} />
                <input type="email" placeholder="Email" value={form.email} onChange={set('email')} className={input} />
              </div>
              <input placeholder="Degrees (e.g. MBBS, FCPS)" value={form.degrees} onChange={set('degrees')} className={input} />
              <textarea rows="2" placeholder="Chamber name & address" value={form.chamberInfo} onChange={set('chamberInfo')} className={input} />
              <textarea rows="2" placeholder="Anything else? (optional)" value={form.message} onChange={set('message')} className={input} />
              <button
                disabled={status === 'sending'}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:brightness-110 disabled:opacity-60"
              >
                {status === 'sending' ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                Submit application
              </button>
              {status === 'offline' && (
                <p className="text-center text-xs font-semibold text-amber-600 dark:text-amber-400">
                  Backend offline — application could not be submitted right now.
                </p>
              )}
              <p className="text-center text-[11px] text-slate-400">
                Submissions are verified against the official BM&DC registry before publishing.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </PageWrap>
  );
}
