import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, Moon, Sun, Bookmark, Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/doctors', label: 'Find Doctors' },
  { to: '/specialties', label: 'Specialties' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/saved', label: 'Saved', icon: Bookmark },
];

export default function Navbar({ theme, toggleTheme, savedCount }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      className="glass sticky top-0 z-50"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-600 text-white shadow-lg shadow-brand-500/30 transition-transform group-hover:scale-105">
            <HeartPulse className="size-5" />
            <span className="absolute inset-0 rounded-2xl bg-brand-500/40 animate-pulse-ring" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Shastho<span className="text-gradient">Sheba</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {Icon && <Icon className="size-4" />}
                  {label}
                  {label === 'Saved' && savedCount > 0 && (
                    <span className="grid size-5 place-items-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                      {savedCount}
                    </span>
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-500/10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid size-10 place-items-center rounded-full text-slate-600 transition hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <motion.span
              key={theme}
              initial={{ rotate: -120, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              className="grid place-items-center"
            >
              {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </motion.span>
          </button>
          <Link
            to="/doctors"
            className="hidden rounded-full bg-gradient-to-r from-brand-600 to-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:shadow-brand-600/40 hover:brightness-110 sm:block"
          >
            Book a Visit
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="grid size-10 place-items-center rounded-full text-slate-600 hover:bg-slate-900/5 md:hidden dark:text-slate-300 dark:hover:bg-white/10"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="overflow-hidden border-t border-slate-200/60 md:hidden dark:border-white/10"
        >
          <div className="flex flex-col gap-1 p-3">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-300'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
