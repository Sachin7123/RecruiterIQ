# RecruiterIQ

See how recruiters **actually** evaluate your LinkedIn profile. Upload a LinkedIn PDF export, get a brutally honest scorecard, AI commentary, and rewrites tuned for startup / FAANG / recruiter scan modes.

**Live app:** [recruiter-iq-wine.vercel.app](https://recruiter-iq-wine.vercel.app)  
**Live demo (no upload):** `/analyze/demo`

## Author

**[Sachin Parmar](https://www.linkedin.com/in/sachinparmar7123)** — Software Engineer

| | |
|---|---|
| LinkedIn | [linkedin.com/in/sachinparmar7123](https://www.linkedin.com/in/sachinparmar7123) |
| GitHub | [github.com/Sachin7123](https://github.com/Sachin7123) |
| Source | [Recruiter-IQ-LinkedIn](https://github.com/Sachin7123/Recruiter-IQ-LinkedIn) |

Built RecruiterIQ to show how hiring teams actually read LinkedIn profiles — deterministic scoring plus AI recruiter commentary.

## What it does

1. **Upload** — LinkedIn “Save to PDF” or resume (max 10MB)
2. **Parse & score** — Deterministic section scores (headline, experience, projects, ATS, branding)
3. **AI recruiter** — Groq `llama-3.3-70b-versatile` commentary (specific, not motivational)
4. **Dashboard** — Section breakdown, weaknesses, rewrite engine, downloadable scorecard PNG

## Tech stack

| Layer | Choice |
|--------|--------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn/ui, Framer Motion |
| Backend | Route Handlers (Node runtime for PDF + Groq) |
| Database | Supabase (PostgreSQL + Storage) |
| AI | Groq SDK — `llama-3.3-70b-versatile`, fallback `llama-3.1-8b-instant` |
| PDF | `pdf-parse` (Node only) |
| Deploy | Vercel |

## Run locally

```bash
cd recruiter-intel
npm install
cp .env.example .env.local
# Fill in GROQ_API_KEY and Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | [Groq console](https://console.groq.com) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side DB + storage (never expose to client) |
| `NEXT_PUBLIC_APP_URL` | No | Canonical URL for OG metadata |

### Supabase setup

1. Run `supabase/migrations/001_phase2_analyses.sql` in the SQL editor
2. Run `supabase/migrations/002_production_rls.sql` for production RLS
3. Confirm `pdf-uploads` storage bucket exists (private, 10MB PDF)

### Health check

`GET /api/health` — verifies Groq + Supabase connectivity (use after deploy).

## Folder structure

```
src/
  app/              # Routes (marketing, analyze, API)
  components/       # UI (landing, dashboard, shared)
  services/         # PDF parse, scoring, AI, rewrite
  lib/              # Supabase, Groq, validations, demo data
  hooks/            # Client analysis flow
supabase/migrations/
sample_output.json  # Example AnalysisResult shape
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all env vars from `.env.example`
4. `vercel.json` sets 60s timeout on `/api/analyze`, 30s on upload/rewrite
5. After deploy: hit `/api/health` and run one full PDF upload test

## Groq rate limits (free tier)

~30 RPM, ~6k TPM — roughly **50–100 full analyses/day**. The app retries once after 2s on HTTP 429, then shows a friendly message.

## Deploy to GitHub + Vercel (step by step)

### 1. Push to GitHub

Install [Git for Windows](https://git-scm.com/download/win) if `git` is not in your PATH. Restart the terminal after install.

```bash
cd d:\Startup_Idea_1\recruiter-intel
git init
git add .
git commit -m "Launch RecruiterIQ MVP"
```

Create a new empty repo on GitHub (e.g. `recruiter-intel`), then:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/recruiter-intel.git
git push -u origin main
```

`.env.local` is gitignored — never commit secrets.

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. **Import** your GitHub repo
3. Root directory: `recruiter-intel` (if the repo root is the app folder, leave default)
4. **Environment variables** (Production + Preview):

   | Name | Value |
   |------|--------|
   | `GROQ_API_KEY` | from Groq console |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
   | `NEXT_PUBLIC_APP_URL` | `https://recruiter-iq-wine.vercel.app` (redeploy after setting) |

5. Click **Deploy**
6. After deploy: open `https://YOUR_URL/api/health` → should be `"status": "healthy"`
7. Test `/analyze/demo` and one real PDF upload

### 3. Supabase production

In Supabase SQL Editor, run migrations `001` and `002` on the **same** project as your env keys.

## License

Private MVP — all rights reserved unless otherwise noted.
