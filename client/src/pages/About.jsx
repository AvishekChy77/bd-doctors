import { motion } from 'framer-motion';
import { HeartPulse, ShieldCheck, AlertTriangle } from 'lucide-react';
import PageWrap, { stagger, fadeUp } from '../components/PageWrap';

const faqs = [
  {
    q: 'How do I book an appointment?',
    a: 'Open a doctor’s profile, check the chamber schedule, then either call the chamber directly or use the "Request appointment" form — the chamber calls back to confirm your serial.',
  },
  {
    q: 'Are the doctors verified?',
    a: 'Every listed profile shows a BMDC registration number. Always cross-check a practitioner on the official BM&DC registry (bmdc.org.bd) before visiting.',
  },
  {
    q: 'Is this service free for patients?',
    a: 'Yes — searching, browsing and requesting appointments are completely free. You only pay the doctor’s consultation fee at the chamber.',
  },
  {
    q: 'I am a doctor. How do I get listed?',
    a: 'Use the "Join as a Doctor" page and submit your BMDC number, specialty and chamber details. Listings are published after verification.',
  },
];

export default function About() {
  return (
    <PageWrap className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-emerald-600 text-white shadow-xl shadow-brand-500/30">
          <HeartPulse className="size-8" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
          About <span className="text-gradient">ShasthoSheba</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
          ShasthoSheba connects patients across Bangladesh with specialist doctors —
          their qualifications, chambers, visiting hours, fees and contact details —
          so that finding the right care takes minutes, not days.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-10 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6 text-sm leading-relaxed text-amber-700 dark:text-amber-300"
      >
        <p className="mb-2 flex items-center gap-2 font-bold">
          <AlertTriangle className="size-4" /> Demo data disclaimer
        </p>
        This is a demonstration project. All doctor profiles are <b>fictional sample
        data</b>. Hospital names are real institutions used for illustration only;
        phone numbers, emails and BMDC registration numbers are placeholders. Do not
        use this site to seek real medical care.
      </motion.div>

      <h2 className="mt-14 flex items-center gap-2 text-2xl font-extrabold">
        <ShieldCheck className="size-6 text-brand-500" /> Frequently asked questions
      </h2>
      <motion.div variants={stagger} initial="hidden" animate="show" className="mt-6 space-y-3">
        {faqs.map(({ q, a }) => (
          <motion.details
            key={q}
            variants={fadeUp}
            className="group rounded-2xl border border-slate-200/70 bg-white p-5 open:border-brand-500/40 dark:border-white/10 dark:bg-slate-900"
          >
            <summary className="cursor-pointer list-none font-bold marker:hidden">
              {q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{a}</p>
          </motion.details>
        ))}
      </motion.div>
    </PageWrap>
  );
}
