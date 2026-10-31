import { slugify } from './constants';
import { getDoctors } from './api';

/**
 * Hospitals are derived from chamber data — every unique chamber name
 * becomes a hospital entry with its doctors, districts and specialties.
 */
export async function getHospitals() {
  const { doctors } = await getDoctors({});
  const map = new Map();

  for (const d of doctors) {
    for (const c of d.chambers) {
      const slug = slugify(c.name);
      if (!map.has(slug)) {
        map.set(slug, {
          slug,
          name: c.name,
          address: c.address,
          district: c.district,
          doctors: [],
          specialties: new Set(),
        });
      }
      const h = map.get(slug);
      if (!h.doctors.some((x) => x.slug === d.slug)) h.doctors.push(d);
      h.specialties.add(d.specialty);
    }
  }

  return [...map.values()]
    .map((h) => ({ ...h, specialties: [...h.specialties] }))
    .sort((a, b) => b.doctors.length - a.doctors.length);
}

export async function getHospital(slug) {
  const all = await getHospitals();
  return all.find((h) => h.slug === slug) ?? null;
}
