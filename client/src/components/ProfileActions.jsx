import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Printer, QrCode, Check, X } from 'lucide-react';
import QRCode from 'qrcode';

export default function ProfileActions({ doctor }) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  const url = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (!qrOpen || qrUrl) return;
    QRCode.toDataURL(url, { width: 480, margin: 2 }).then(setQrUrl).catch(() => {});
  }, [qrOpen, qrUrl, url]);

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: doctor.name, text: `${doctor.name} — ${doctor.specialty}`, url });
        return;
      }
      throw new Error('no web share');
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {
        /* clipboard unavailable */
      }
    }
  };

  const btn =
    'flex items-center gap-1.5 rounded-xl bg-slate-900/5 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-900/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15 print:hidden';

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button onClick={share} className={btn}>
          {copied ? <Check className="size-3.5 text-emerald-500" /> : <Share2 className="size-3.5" />}
          {copied ? 'Link copied!' : 'Share'}
        </button>
        <button onClick={() => window.print()} className={btn}>
          <Printer className="size-3.5" /> Print
        </button>
        <button onClick={() => setQrOpen(true)} className={btn}>
          <QrCode className="size-3.5" /> QR code
        </button>
      </div>

      <AnimatePresence>
        {qrOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQrOpen(false)}
            className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm print:hidden"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl dark:bg-slate-900"
            >
              <button
                onClick={() => setQrOpen(false)}
                aria-label="Close"
                className="absolute top-3 right-3 grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-900/5 dark:hover:bg-white/10"
              >
                <X className="size-4" />
              </button>
              <h3 className="font-extrabold">Scan to open profile</h3>
              <p className="font-bangla mt-0.5 text-xs text-slate-400">প্রোফাইল শেয়ার করতে QR স্ক্যান করুন</p>
              {qrUrl ? (
                <img src={qrUrl} alt={`QR code for ${doctor.name}'s profile`} className="mx-auto mt-4 w-56 rounded-2xl border border-slate-200 dark:border-white/10" />
              ) : (
                <div className="mx-auto mt-4 grid size-56 place-items-center text-sm text-slate-400">Generating…</div>
              )}
              <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{doctor.name}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
