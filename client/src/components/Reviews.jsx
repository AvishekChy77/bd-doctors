import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Loader2, Send, MessageSquareHeart } from 'lucide-react';
import { postReview } from '../lib/api';

const Stars = ({ value, size = 'size-4' }) => (
  <span className="flex gap-0.5 text-amber-400">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} className={`${size} ${n <= value ? 'fill-current' : 'opacity-25'}`} />
    ))}
  </span>
);

export default function Reviews({ doctor }) {
  const [reviews, setReviews] = useState(doctor.reviews ?? []);
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const res = await postReview(doctor.slug, form);
    if (res.ok) {
      setReviews((r) => [{ ...form, date: new Date().toISOString().slice(0, 10) }, ...r]);
      setForm({ name: '', rating: 5, comment: '' });
      setStatus('ok');
    } else {
      setStatus('offline');
    }
  };

  const input =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-slate-900';

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-6 dark:border-white/10 dark:bg-slate-900 print:hidden">
      <h2 className="flex items-center gap-2 font-extrabold">
        <MessageSquareHeart className="size-5 text-brand-500" />
        Patient feedback ({reviews.length})
      </h2>

      <div className="mt-4 space-y-4">
        {reviews.length === 0 && (
          <p className="text-sm text-slate-400">No feedback yet — be the first to share your experience.</p>
        )}
        {reviews.map((r, i) => (
          <motion.div
            key={`${r.name}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold">{r.name}</p>
              <Stars value={r.rating} size="size-3.5" />
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{r.comment}</p>
            {r.date && <p className="mt-1.5 text-[11px] text-slate-400">{r.date}</p>}
          </motion.div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-3 border-t border-slate-100 pt-5 dark:border-white/5">
        <h3 className="text-sm font-bold">Share your experience</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">Your rating:</span>
          <span className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setForm((f) => ({ ...f, rating: n }))}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                className="text-amber-400 transition hover:scale-125"
              >
                <Star className={`size-5 ${n <= form.rating ? 'fill-current' : 'opacity-25'}`} />
              </button>
            ))}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={input}
          />
          <input
            required
            placeholder="How was your visit?"
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            className={input}
          />
        </div>
        <button
          disabled={status === 'sending'}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-brand-600 disabled:opacity-60 dark:bg-white/10 dark:hover:bg-brand-600"
        >
          {status === 'sending' ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
          Post feedback
        </button>
        {status === 'offline' && (
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            Backend offline — feedback could not be saved.
          </p>
        )}
      </form>
    </section>
  );
}
