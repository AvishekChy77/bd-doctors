/**
 * One-time importer: Square Hospitals doctors from sasthyaseba.com.
 * Extracts FACTUAL fields only (no biography prose). Unknown fields stay null.
 * Output: client/src/lib/squareDoctors.json
 */
import { writeFileSync } from 'node:fs';

const BASE = 'https://sasthyaseba.com';
const LIST = `${BASE}/hospitals/square-hospitals-ltd/doctors`;
const UA = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const strip = (h) =>
  h
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{2,}/g, '\n');

const DEGREE_RX =
  /\b(MBBS|BDS|FCPS|MCPS|MD|MS|MPhil|MPH|MSc|MSS|MRCP|FRCP|FRCS|MRCS|FACS|FICS|FACC|FSCAI|FESC|PhD|Dip|Diploma|DLO|DGO|DCH|DDV|DEM|DTCD|DA\b|DO\b|CCD|FCGP|BCS|Fellow|Fellowship|Training|Trained|PGT|MMEd|DMU|D-Card|FRCOG|MRCOG|MRCPCH|FRCPCH|FAAP|MACP|FACP|FICO|FAcs|IELTS|AO |WHO|Higher|Advanced|Course)\b/i;

const DAY_MAP = { Sat: 'Sat', Sun: 'Sun', Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Thur: 'Thu', Fri: 'Fri' };
const SLOT_RX = /^((?:Sat|Sun|Mon|Tue|Wed|Thur?|Fri)(?:\s+(?:Sat|Sun|Mon|Tue|Wed|Thur?|Fri))*)\s+(\d{1,2}:\d{2})\s*([AP]M)\s*-\s*(\d{1,2}:\d{2})\s*([AP]M)$/i;

const to24 = (t, ap) => {
  let [h, m] = t.split(':').map(Number);
  if (/pm/i.test(ap) && h !== 12) h += 12;
  if (/am/i.test(ap) && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const parseSlot = (line) => {
  const m = line.match(SLOT_RX);
  if (!m) return null;
  const days = m[1].split(/\s+/).map((d) => DAY_MAP[d]).filter(Boolean);
  return days.map((day) => ({ day, start: to24(m[2], m[3]), end: to24(m[4], m[5]) }));
};

const districtOf = (addr) => {
  for (const d of ['Dhaka', 'Chattogram', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh', 'Cumilla', 'Bogura'])
    if (new RegExp(d, 'i').test(addr)) return d === 'Chittagong' ? 'Chattogram' : d;
  return null;
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

async function fetchText(url) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, UA);
      if (r.ok) return r.text();
    } catch { /* retry */ }
    await sleep(1200);
  }
  return null;
}

/* 1. collect doctor slugs across listing pages */
const slugs = new Set();
for (let page = 1; page <= 30; page++) {
  const html = await fetchText(`${LIST}?page=${page}`);
  if (!html) break;
  const before = slugs.size;
  for (const m of html.matchAll(/href="\/doctors\/([a-z0-9-]+)"/g)) slugs.add(m[1]);
  console.log(`page ${page}: total ${slugs.size}`);
  if (slugs.size === before) break; // no new → past the end
  await sleep(400);
}

/* 2. fetch + parse each detail page */
const doctors = [];
let n = 0;
for (const srcSlug of slugs) {
  n++;
  const html = await fetchText(`${BASE}/doctors/${srcSlug}`);
  if (!html) { console.log(`!! skip ${srcSlug}`); continue; }
  const lines = strip(html).split('\n').map((l) => l.trim()).filter(Boolean);

  const stopIdx = lines.findIndex((l) => /^BMDC Reg/i.test(l) || /Years? of Experience/i.test(l) || /^ID:\s*D/.test(l));
  let supportIdx = -1;
  for (let i = 0; i < stopIdx; i++) if (lines[i] === 'Support') supportIdx = i;
  if (stopIdx < 0 || supportIdx < 0) { console.log(`!! no header ${srcSlug}`); continue; }

  const name = lines[supportIdx + 1];
  const chunk = lines.slice(supportIdx + 2, stopIdx);
  // trailing non-degree lines = specialties
  let split = chunk.length;
  while (split > 0 && !DEGREE_RX.test(chunk[split - 1])) split--;
  const degrees = chunk.slice(0, split);
  const specialties = chunk.slice(split);

  const expLine = lines.find((l) => /^\d+\+?\s+Years? of Experience/i.test(l));
  const experienceYears = expLine ? Number(expLine.match(/^(\d+)/)[1]) : null;
  const bmdcLine = lines.find((l) => /^BMDC Reg/i.test(l));
  let bmdcRegNo = bmdcLine ? bmdcLine.replace(/^BMDC Reg\.?:\s*/i, '').trim() : null;
  if (!bmdcRegNo || /coming soon/i.test(bmdcRegNo)) bmdcRegNo = null;
  const phoneLine = lines.find((l) => /^Phone:\s*\+?[\d ()-]{8,}$/.test(l));
  const phone = phoneLine ? phoneLine.replace(/^Phone:\s*/, '').trim() : null;

  /* locations from the Info section */
  const chambers = [];
  const locIdx = lines.findIndex((l, i) => l === 'Locations' && lines[i - 1] === 'Info');
  if (locIdx > -1) {
    let i = locIdx + 1;
    const end = lines.findIndex((l, j) => j > locIdx && ['Field of Concentration', 'About', 'Reviews', 'Related Doctors'].includes(l));
    const stop = end > -1 ? end : Math.min(lines.length, locIdx + 80);
    while (i < stop) {
      if (/^(Cash|Card|Mobile Banking|bKash|Nagad|Online Payment)$/i.test(lines[i])) { i++; continue; }
      if (['Availability', 'Book Appointment', 'Schedule Appointment'].includes(lines[i])) { i++; continue; }
      // a chamber: name line followed by an address-ish line
      if (i + 1 < stop && /Bangladesh$|Dhaka|Road|Avenue|Sarak|Plot|House/i.test(lines[i + 1]) && !parseSlot(lines[i])) {
        const cName = lines[i];
        const cAddr = lines[i + 1];
        i += 2;
        const schedule = [];
        while (i < stop && (['Availability'].includes(lines[i]) || parseSlot(lines[i]))) {
          const slots = parseSlot(lines[i]);
          if (slots) schedule.push(...slots);
          i++;
        }
        while (i < stop && ['Book Appointment', 'Schedule Appointment'].includes(lines[i])) i++;
        chambers.push({
          name: cName, address: cAddr, district: districtOf(cAddr),
          room: null, phone: null, fee: null, followUpFee: null, schedule,
        });
      } else i++;
    }
  }

  /* services (facts) */
  const svcIdx = lines.indexOf('Field of Concentration');
  const services = [];
  if (svcIdx > -1) {
    for (let i = svcIdx + 1; i < Math.min(lines.length, svcIdx + 12); i++) {
      if (['About', 'Info', 'Reviews', 'Show More', 'Related Doctors'].includes(lines[i])) break;
      if (lines[i].length < 70) services.push(lines[i]);
    }
  }

  doctors.push({
    slug: slugify(name), srcSlug, name,
    degrees, specialties, experienceYears, bmdcRegNo, phone,
    chambers, services: services.slice(0, 8),
    source: 'sasthyaseba.com', sourceUrl: `${BASE}/doctors/${srcSlug}`,
  });
  if (n % 10 === 0) console.log(`parsed ${n}/${slugs.size}`);
  await sleep(350);
}

writeFileSync(new URL('../client/src/lib/squareDoctors.json', import.meta.url), JSON.stringify(doctors, null, 1));
console.log(`DONE: ${doctors.length} doctors written`);
console.log('unique specialties:', JSON.stringify([...new Set(doctors.flatMap((d) => d.specialties))]));
console.log('with schedule:', doctors.filter((d) => d.chambers.some((c) => c.schedule.length)).length,
  '| with bmdc:', doctors.filter((d) => d.bmdcRegNo).length,
  '| with phone:', doctors.filter((d) => d.phone).length,
  '| chambers total:', doctors.reduce((s, d) => s + d.chambers.length, 0));