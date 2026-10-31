# 🩺 ShasthoSheba — Bangladeshi Doctor Directory

A full-stack directory of doctors in Bangladesh: qualifications, chambers, weekly schedules and contact info — with an animated, eye-catching UI.

> ⚠️ **Demo data notice:** all doctor profiles bundled with this project are fictional sample data. Hospital names are real institutions used for illustration only; phone numbers and BMDC registration numbers are placeholders.

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 19 · Vite · Tailwind CSS v4 · Framer Motion · React Router 7 · Lucide icons |
| Backend  | Node.js · Express 5 · Mongoose 8 |
| Database | MongoDB |

## Quick start

```bash
# 1. install everything
npm install
npm run install:all

# 2. (optional) start MongoDB and seed sample data
npm run seed

# 3. run client + server together
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5000/api

The frontend works even **without** the backend/MongoDB — it transparently falls back to bundled sample data until the API is reachable.

## Server environment

Copy `server/.env.example` to `server/.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/bd_doctors
PORT=5000
```

## API overview

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | liveness + DB status |
| GET | `/api/doctors` | list, supports `q, specialty, district, gender, day, maxFee, sort, page, limit` |
| GET | `/api/doctors/:slug` | single doctor |
| GET | `/api/specialties` | specialties with doctor counts |
| GET | `/api/stats` | totals for hero counters |
| POST | `/api/appointments` | appointment request `{doctorSlug, chamberName, name, phone, preferredDay, note}` |

## Features

- 🔍 Instant search + filters: specialty, district, gender, consultation fee, weekday availability
- 🗓️ Per-chamber weekly schedule tables with fees & follow-up fees
- 📞 One-tap call / email, save-for-later (localStorage)
- 🌙 Dark / light theme, animated page transitions, scroll-reveal cards
- 🇧🇩 Bangla name rendering (Hind Siliguri font)
