import { DAYS } from '../lib/constants';

const fmt = (t) => {
  const [h, m] = t.split(':').map(Number);
  const am = h < 12;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${am ? 'AM' : 'PM'}`;
};

const todayShort = () =>
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

export default function ScheduleTable({ schedule }) {
  const byDay = Object.fromEntries(schedule.map((s) => [s.day, s]));
  const today = todayShort();

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {DAYS.map((d) => {
        const slot = byDay[d];
        const isToday = d === today;
        return (
          <div
            key={d}
            className={`rounded-xl border p-2 text-center transition ${
              slot
                ? 'border-brand-500/30 bg-brand-500/10'
                : 'border-slate-100 bg-slate-50/50 opacity-50 dark:border-white/5 dark:bg-white/[0.02]'
            } ${isToday ? 'ring-2 ring-brand-500/60' : ''}`}
          >
            <p
              className={`text-[11px] font-extrabold uppercase ${
                slot ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'
              }`}
            >
              {d}
            </p>
            {slot ? (
              <p className="mt-1 text-[10px] font-semibold leading-tight text-slate-600 dark:text-slate-300">
                {fmt(slot.start)}
                <br />– {fmt(slot.end)}
              </p>
            ) : (
              <p className="mt-1 text-[10px] text-slate-400">—</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
