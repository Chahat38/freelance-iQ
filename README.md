# FreelanceIQ AI OS

**An all-in-one AI-powered workspace for freelancers and remote workers** — proposals, invoices, contract analysis, scam detection, gig/profile optimization, client CRM, task management, and an AI mentor, all in one dashboard.

🔗 Live demo: [freelance-i-q.vercel.app](https://freelance-i-q.vercel.app/)

---

## ✨ Overview

FreelanceIQ AI OS is a React + TypeScript single-page application built to act as a "second brain" and productivity OS for freelancers working on platforms like Upwork, Fiverr, LinkedIn, and direct clients. Every AI-driven module sends a prompt to a small Express/Vercel serverless backend, which proxies the request to **Google's Gemini API**, keeping the API key server-side and out of the browser bundle.

The app currently runs on **mocked authentication and browser `localStorage` persistence** — there is no real database or auth server yet — so it's best understood as a fully working front-end product / MVP prototype with a real, working AI backend.

---

## 🧩 Key Features

### Overview
- **Dashboard** — productivity score, streaks, AI tasks completed, quick stats
- **AI Mentor** — chat-style strategy assistant for freelancing questions *(Pro)*

### AI Proposals & Clients
- **Proposal Generator** — paste a job post and generate Professional / Friendly / Premium / Short proposal variants, with a score and improvement suggestions
- **Proposal Analyzer** — scores a proposal on grammar, professionalism, confidence, formatting, personalization, and CTA strength
- **Client Reply Generator** — turns a client message into 9 tone variants (professional, friendly, negotiation, price increase, project delay, meeting, revision, follow-up, thank you)
- **Cold Email Generator** — outbound outreach email drafting

### Profile & SEO
- **Fiverr / Upwork Gig SEO Optimizer** — rewrites gig titles/descriptions, suggests keywords, tags, and estimates ranking chance & competition
- **Profile Optimizer** — optimized bio, SEO keywords, recommended skills, trust-building tips
- **LinkedIn Optimizer** — headline, About section, and experience rewrites with SEO keywords and posting ideas
- **Portfolio Reviewer** — design/professionalism scoring, missing sections, hiring-chance estimate
- **AI Cover Letter** — cover letter generation
- **Resume Reviewer** — ATS score, missing skills/projects, improvement suggestions

### Safety & Contracts
- **Contract & NDA Risk Analyzer** — extracts scope, deliverables, payment terms, deadlines, risks, and penalty clauses, then assigns a risk score (Green/Yellow/Red)
- **Client Scam & Fraud Detector** — analyzes chat/message text for scam probability, red flags, green flags, and recommended action
- **Client Sentiment Analyzer** — detects tone (Positive/Neutral/Negative/Urgent/Confused) and buying intent from a client message

### Finance & Estimates
- **Multi-Currency Invoice Generator** — line items, tax, discount, due dates, status tracking (Paid/Pending/Overdue), and **PDF export** via `jsPDF`
- **Price & Rate Estimator** — min / recommended / premium price suggestions in USD & PKR, with a negotiation range and reasoning
- **Time & Milestone Estimator** — breaks a project into hours/days/weeks and milestone-by-milestone plan
- **Grammar & Text Polish** — quick grammar/tone cleanup

### Workspace OS
- **Task Manager** — priority, due dates, status, AI-suggested tasks
- **Client CRM** — client records with platform, status, revenue billed, notes, and follow-up dates (grid & list views)
- **Notes & Markdown Editor** — folders + markdown notes
- **Document Library**
- **History Log** — searchable archive of every AI generation, with favoriting
- **Settings & Tax** — currency, theme, language (English / Roman Urdu) preferences

### Extras
- Command Palette (quick keyboard navigation)
- Voice Assistant modal
- Dark mode (default) / light mode
- Toast notification system

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 + TypeScript, React Router v7 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Animation | `motion` (Framer Motion successor) |
| Icons | `lucide-react` |
| Charts | `recharts` |
| PDF export | `jspdf` |
| Backend server | Express 4 (local dev) / Vercel Serverless Functions (production) |
| AI provider | Google Gemini API via `@google/genai` |
| Dev runtime | `tsx` (TypeScript execution) |
| Bundling (server) | `esbuild` |

---

## 🏗 Architecture

```
Browser (React SPA)
   │
   │  fetch('/api/ai/generate', { prompt, systemInstruction, isJson, responseSchema })
   ▼
Express (dev) / Vercel Function (prod)  →  api/ai/generate.ts
   │
   │  GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
   ▼
Google Gemini API
```

- **`server.ts`** — Express server used for local development. It mounts the same handler files (`api/health.ts`, `api/ai/generate.ts`) that Vercel uses in production, so local dev and production behavior stay in sync. In dev it wraps Vite in middleware mode; in production it serves the built `dist/` folder.
- **`api/ai/generate.ts`** — the single AI proxy endpoint. Accepts `{ prompt, systemInstruction, isJson, responseSchema }`, calls Gemini (`gemini-3.6-flash` model), retries once automatically on rate-limit (HTTP 429), and returns `{ success, text, isFallback }`. Requires `GEMINI_API_KEY` — returns a clear error if it's missing.
- **`api/health.ts`** — simple health check that also reports whether `GEMINI_API_KEY` is configured, without leaking the key itself.
- **`src/context/AppContext.tsx`** — the single global state provider. Holds the user, theme, currency/language preferences, and every data collection (proposals, invoices, contracts, tasks, clients, notes, history). All of this is persisted to **`localStorage`** (not a database) and rehydrated on load. It also exposes `runAiPrompt()`, the one function every module uses to call the AI backend, plus a toast notification system.
- **Routing (`src/App.tsx`)** — `react-router-dom` v7. `/` is the public landing page, `/login` is the (mocked) auth page, and everything under `/app/*` is a protected route guarded by `ProtectedRoute`, which just checks `user.isLoggedIn` in context — there is no server-side session/auth yet.

---

## 📁 Project Structure

```
freelance-iQ/
├── api/
│   ├── health.ts              # GET/health check + Gemini key status
│   └── ai/generate.ts         # POST proxy to Gemini API
├── src/
│   ├── components/
│   │   ├── layout/            # LandingPage, AuthPage, AppLayout, Navbar, Sidebar,
│   │   │                        CommandPalette, VoiceAssistantModal
│   │   ├── modules/            # One component per AI/workspace feature (18 modules)
│   │   └── ui/                # Shared UI primitives (Toast, etc.)
│   ├── context/AppContext.tsx # Global state, localStorage persistence, AI proxy call
│   ├── lib/pdfGenerator.ts     # jsPDF invoice export logic
│   ├── types/index.ts         # All shared TypeScript interfaces
│   ├── App.tsx                # Routes
│   ├── main.tsx                # React entry point
│   └── index.css               # Tailwind entry
├── server.ts                   # Express dev/prod server
├── vite.config.ts
├── vercel.json                 # Vercel build + SPA rewrite config
├── metadata.json                # App name/description (AI Studio metadata)
├── package.json
└── .env.example
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or Bun, since a `bun.lock` is present)
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone & install
```bash
git clone https://github.com/Chahat38/freelance-iQ.git
cd freelance-iQ
npm install        # or: bun install
```

### 2. Configure environment variables
Copy the example file and add your key:
```bash
cp .env.example .env
```
```env
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=https://your-app-domain.vercel.app   # optional
```

### 3. Run in development
```bash
npm run dev
```
This starts the Express server (with Vite in middleware mode) at **http://localhost:3000**.

### 4. Build for production
```bash
npm run build       # vite build + esbuild-bundles server.ts → dist/server.cjs
npm start            # node dist/server.cjs
```

### Other scripts
| Command | Purpose |
|---|---|
| `npm run preview` | Preview the Vite production build |
| `npm run lint` | Type-check only (`tsc --noEmit`) |
| `npm run clean` | Remove `dist/` and compiled server output |

---

## ☁️ Deployment (Vercel)

The project is already configured for Vercel via `vercel.json`:
- `buildCommand`: `vite build`
- `outputDirectory`: `dist`
- SPA rewrite: every non-`/api/*` route falls back to `index.html` so client-side routing works
- `api/health.ts` and `api/ai/generate.ts` are auto-detected as **Vercel Serverless Functions**

**Required Vercel setting:** add `GEMINI_API_KEY` under *Project Settings → Environment Variables*. Without it, `/api/ai/generate` returns HTTP 500 with a descriptive error, and `/api/health` will report `geminiKeyConfigured: false`.

---

## ⚠️ Current Limitations (good next steps)

- **No real backend database** — all user data (proposals, invoices, tasks, clients, notes, history) lives in the browser's `localStorage`. Clearing browser data or switching devices loses everything.
- **No real authentication** — `AuthPage` writes a mock user object straight to `localStorage`; there's no password hashing, session, or server-side user store.
- **Single shared demo user** — `defaultUser` in `AppContext.tsx` is hardcoded (`Hamza Khan`), used until overwritten by login.
- **No automated tests** — there is currently no test suite in the repo.

These are natural next milestones if you want to turn this into a production multi-user product (e.g., add Postgres/Supabase + real auth like NextAuth/Clerk, and move data collections from `localStorage` into API-backed CRUD routes).

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes and open a PR

---

## 📄 License

No license file is currently present in the repository — add a `LICENSE` file (MIT, Apache-2.0, etc.) to clarify usage rights before sharing or open-sourcing further.
