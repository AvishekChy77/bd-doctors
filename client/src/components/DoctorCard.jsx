import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Bookmark, BadgeCheck } from 'lucide-react';
import { avatarGradient, initials, specialtyMeta } from '../lib/constants';
import { fadeUp } from './PageWrap';

export default function DoctorCard({ doctor, isSaved, onToggleSave }) {
  const meta = specialtyMeta(doctor.specialty);
  const Icon = meta.icon;
  const minFee = Math.min(...doctor.chambers.map((c) => c.fee));
  const days = [...new Set(doctor.chambers.flatMap((c) => c.schedule.map((s) => s.day)))];

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl hover:shadow-brand-500/10 dark:border-white/10 dark:bg-slate-900"
    >
      <div
        className={`pointer-events-none absolute -top-20 -right-20 size-48 rounded-full bg-gradient-to-br ${meta.glow} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
      />

      <div className="flex items-start gap-4">
        <div
          className={`grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${avatarGradient(doctor.slug)} text-xl font-extrabold text-white shadow-lg`}
        >
          {initials(doctor.name)}
        </div>
        <div className="min-w-0 flex-1">
          <Link to={`/doctors/${doctor.slug}`} className="block">
            <h3 className="truncate font-bold leading-snug transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400">
              {doctor.name}
            </h3>
          </Link>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {doctor.degrees.slice(0, 2).join(' · ')}
          </p>
          <span
            className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.chip}`}
          >
            <Icon className="size-3" /> {doctor.specialty}
          </span>
        </div>
        <button
          onClick={() => onToggleSave?.(doctor.slug)}
          aria-label={isSaved ? 'Remove from saved' : 'Save doctor'}
          className={`grid size-9 shrink-0 place-items-center rounded-full transition ${
            isSaved
              ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
              : 'text-slate-400 hover:bg-slate-900/5 hover:text-slate-600 dark:hover:bg-white/10'
          }`}
        >
          <Bookmark className={`size-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
        <p className="flex items-center gap-1.5">
          <BadgeCheck className="size-3.5 text-brand-500" />
          <span className="truncate">{doctor.designation}, {doctor.workplace}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-brand-500" />
          <span className="truncate">
            {[...new Set(doctor.chambers.map((c) => c.district))].join(', ')} ·{' '}
            {doctor.chambers.length} chamber{doctor.chambers.length > 1 ? 's' : ''}
          </span>
        </p>
        <p className="flex items-center gap-1.5">
          <Clock className="size-3.5 text-brand-500" />
          {days.join(' · ')}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5">
        <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
          <Star className="size-4 fill-current" />
          {doctor.rating}
          <span className="text-xs font-medium text-slate-400">
            ({doctor.reviewsCount})
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wide text-slate-400">from </span>
          <span className="font-extrabold text-brand-600 dark:text-brand-400">
            ৳{minFee}
          </span>
        </div>
      </div>

      <Link
        to={`/doctors/${doctor.slug}`}
        className="mt-4 block rounded-xl bg-slate-900 py-2.5 text-center text-sm font-bold text-white transition hover:bg-brand-600 dark:bg-white/10 dark:hover:bg-brand-600"
      >
        View Profile & Schedule
      </Link>
    </motion.article>
  );
}
