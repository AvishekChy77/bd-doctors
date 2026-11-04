# 🩺 ShasthoSheba — Bangladeshi Doctor Directory

**Live site:** https://shasthosheba.netlify.app

A full-stack directory of doctors in Bangladesh — qualifications, chambers, visiting schedules, fees and contact info — with an animated, mobile-friendly UI.

## Data

Listings come from two sources, clearly separated:

| Source | Count | What it contains |
|---|---|---|
| **Imported** (sasthyaseba.com) | 112 doctors at Square Hospitals Ltd. | Factual fields only: name, degrees, specialty, experience, chambers, visiting hours, services. Each profile links back to its source. |
| **Demo entries** | 36 fictional doctors | Kept for demonstration breadth across districts/specialties. Carry **no** fees, schedules, phones or registration numbers — those were placeholders and were removed. |

**The missing-data rule:** anything not actually known (fee, visiting hours, BMDC number, phone…) is stored as `null` and rendered as a "—" marker with a tooltip — never invented. Reviews on demo entries are illustrative; imported profiles start with zero reviews.

> ⚠️ Details like fees and visiting hours change often. Always confirm with the chamber and verify practitioners via the official BM&DC registry (bmdc.org.bd) before visiting.

## Stack & architecture

| Layer | Tech | Hosting |
|---|---|---|
| Frontend | React 19 · Vite · Tailwind CSS v4 · Framer Motion · React Router 7 | Netlify CDN |
| API | Express 5 wrapped by `serverless-http` | Netlify Functions (`netlify/functions/api.mjs`) |
| Database | MongoDB Atlas (M0), Mongoose 8 | Atlas, AWS Mumbai |

The same Express app (`server/src/app.js`) runs locally (`server/src/index.js`) and as the serverless function. The frontend transparently falls back to bundled data when the API is unreachable.

## Features

- 🔍 Instant search + filters: specialty (data-driven), district, gender, fee, weekday
- 🏥 Hospitals directory with per-hospital doctor listings and embedded maps
- 🗓️ Weekly schedule tables (multiple sessions per day supported)
- ⭐ Patient reviews with live rating recalculation
- 📱 Share / print / QR-code for every profile, one-tap call where published
- 📋 Appointment requests & "Join as a Doctor" applications, stored in Atlas
- 🌙 Dark / light theme, Bangla typography, animated transitions, saved doctors

## Quick start

```bash
npm install && npm run install:all

# server/.env  (copy from server/.env.example)
# MONGODB_URI=mongodb://127.0.0.1:27017/bd_doctors  (or an Atlas URI)

npm run seed   # load the 148 doctors into the DB
npm run dev    # client :5173 + API :5000
```

## Deploying

```bash
npm run deploy          # build + deploy to Netlify (site: shasthosheba)
npm run deploy:ghpages  # optional static mirror on GitHub Pages
```

Netlify needs the `MONGODB_URI` environment variable (`netlify env:set`), and Atlas must allow Netlify's egress IPs (0.0.0.0/0).

## Data pipeline (one-time import)

```bash
node tools/scrape-sasthyaseba.mjs   # fetch listing + profile pages → squareDoctors.json
node tools/transform-real.mjs       # clean, map specialties → realDoctors.js
npm run seed                        # push combined data to MongoDB
```

The importer extracts factual fields only (no biography prose), rate-limits politely, and records a `sourceUrl` on every imported profile.

## API overview

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | liveness + DB status |
| GET | `/api/doctors` | list; `q, specialty, district, gender, day, maxFee, sort, page, limit` |
| GET | `/api/doctors/:slug` | single doctor |
| POST | `/api/doctors/:slug/reviews` | add review `{name, rating, comment}` |
| GET | `/api/specialties` | specialties with counts |
| GET | `/api/stats` | totals for the hero counters |
| POST | `/api/appointments` | appointment request |
| POST | `/api/join` | doctor listing application |
