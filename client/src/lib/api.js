import { DOCTORS } from './doctors';

const BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * The client works with or without the backend:
 * every call tries the API first and silently falls back to the
 * bundled sample data, so the frontend is fully usable standalone.
 */
let apiAlive = null; // cache after first probe

async function tryFetch(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function apiAvailable() {
  if (apiAlive !== null) return apiAlive;
  try {
    const h = await tryFetch('/health');
    apiAlive = h?.db === 'connected';
  } catch {
    apiAlive = false;
  }
  return apiAlive;
}

/* ---------- local fallback helpers ---------- */

function localFilter({ q, specialty, district, gender, day, maxFee, sort }) {
  let list = [...DOCTORS];
  if (q) {
    const needle = q.toLowerCase();
    list = list.filter((d) =>
      [d.name, d.nameBn, d.specialty, d.workplace, d.designation]
        .concat(d.chambers.map((c) => `${c.name} ${c.address}`))
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }
  if (specialty) list = list.filter((d) => d.specialty === specialty);
  if (district)
    list = list.filter((d) => d.chambers.some((c) => c.district === district));
  if (gender) list = list.filter((d) => d.gender === gender);
  if (day)
    list = list.filter((d) =>
      d.chambers.some((c) => c.schedule.some((s) => s.day === day)),
    );
  if (maxFee)
    list = list.filter((d) => Math.min(...d.chambers.map((c) => c.fee)) <= maxFee);

  if (sort === 'fee-asc')
    list.sort(
      (a, b) =>
        Math.min(...a.chambers.map((c) => c.fee)) -
        Math.min(...b.chambers.map((c) => c.fee)),
    );
  else if (sort === 'experience')
    list.sort((a, b) => b.experienceYears - a.experienceYears);
  else list.sort((a, b) => b.rating - a.rating);

  return list;
}

/* ---------- public API ---------- */

export async function getDoctors(params = {}) {
  try {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v)),
    ).toString();
    const data = await tryFetch(`/doctors${qs ? `?${qs}` : ''}`);
    return { doctors: data.doctors, total: data.total, source: 'api' };
  } catch {
    const list = localFilter(params);
    return { doctors: list, total: list.length, source: 'local' };
  }
}

export async function getDoctor(slug) {
  try {
    return await tryFetch(`/doctors/${slug}`);
  } catch {
    return DOCTORS.find((d) => d.slug === slug) ?? null;
  }
}

export async function getStats() {
  try {
    return await tryFetch('/stats');
  } catch {
    return {
      doctors: DOCTORS.length,
      specialties: new Set(DOCTORS.map((d) => d.specialty)).size,
      chambers: DOCTORS.reduce((n, d) => n + d.chambers.length, 0),
      districts: new Set(DOCTORS.flatMap((d) => d.chambers.map((c) => c.district)))
        .size,
    };
  }
}

export async function getSpecialtyCounts() {
  try {
    return await tryFetch('/specialties');
  } catch {
    const counts = {};
    for (const d of DOCTORS) counts[d.specialty] = (counts[d.specialty] ?? 0) + 1;
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }
}

export async function requestAppointment(payload) {
  try {
    return await tryFetch('/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, offline: true };
  }
}
