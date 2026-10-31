import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function Stat({ value, label, suffix = '+' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-extrabold tracking-tight text-gradient sm:text-4xl">
        {n}
        {suffix}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
  );
}
