import { Link } from 'react-router-dom';
import { HeartPulse, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200/70 bg-white/60 dark:border-white/10 dark:bg-slate-900/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 text-white">
                <HeartPulse className="size-4" />
              </span>
              <span className="text-lg font-extrabold">
                Shastho<span className="text-gradient">Sheba</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Find the right doctor in Bangladesh — qualifications, chambers,
              schedules & contact info in one place.
            </p>
            <p className="font-bangla mt-2 text-sm text-slate-500 dark:text-slate-400">
              আপনার সুস্থতাই আমাদের অগ্রাধিকার।
            </p>
          </div>

          <div className="text-sm">
            <h4 className="mb-3 font-bold">Explore</h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400">
              <li><Link className="hover:text-brand-600" to="/doctors">Find Doctors</Link></li>
              <li><Link className="hover:text-brand-600" to="/specialties">Specialties</Link></li>
              <li><Link className="hover:text-brand-600" to="/hospitals">Hospitals</Link></li>
              <li><Link className="hover:text-brand-600" to="/saved">Saved Doctors</Link></li>
              <li><Link className="hover:text-brand-600" to="/join">Join as a Doctor</Link></li>
              <li><Link className="hover:text-brand-600" to="/about">About & FAQ</Link></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
            <p className="mb-1 flex items-center gap-1.5 font-bold">
              <AlertTriangle className="size-3.5" /> Data disclaimer
            </p>
            Listings combine information gathered from public directories (noted
            on each profile) with clearly-marked demo entries. Details like fees
            and visiting hours change often — always confirm with the chamber,
            and verify practitioners via the official BM&DC registry before
            visiting. Reviews on demo entries are illustrative.
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} ShasthoSheba · Built with React, Express & MongoDB
        </p>
      </div>
    </footer>
  );
}
