# HustleOS

A full-stack life-tracking app that brings goals, finances, health, and career into one place — with AI-powered natural language input so adding data takes seconds, not minutes.

**Live:** [hustle-app-theta.vercel.app](https://hustle-app-theta.vercel.app) &nbsp;·&nbsp; **API Docs:** [backend-hustle-app.onrender.com/docs](https://backend-hustle-app.onrender.com/docs)

---

## Features

### Dashboard
Single-screen overview: today's tasks, habits, financial balance, calories, recent expenses, latest job offers, and a 7-day activity chart. Served from an in-memory cache (30 s TTL) — cache is invalidated the moment any data changes.

### Goals
Create, track, and complete goals with milestones and tasks. AI smart-create: describe an idea in plain text and get a structured goal with milestones and tasks generated automatically (Groq / llama-3.3-70b).

### Finances
Track income and expenses with categories. **Hustle Input** — type a sentence like *"50 PLN coffee and lunch"* and AI extracts the amount, category, and description. CSV export included.

### Health
**AI Meal Logger** — describe what you ate and AI calculates calories, protein, carbs, and fat. Full macro history with CSV export.

### Career
Kanban-style job offer tracker — status, company, notes, salary range, application date.

### Auth
- JWT access tokens (15 min) + refresh tokens (30 days) stored as httpOnly cookies
- Refresh endpoint auto-rotates tokens; logout invalidates the token in DB
- Demo mode: one-click login with pre-filled data, reset runs in the background so login is instant

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query |
| Backend | FastAPI, async SQLAlchemy 2.x, Alembic, asyncpg |
| Database | PostgreSQL (Supabase) |
| AI | Groq API — `llama-3.3-70b-versatile` |
| Monitoring | Sentry (backend + frontend), structured JSON logs |
| Deploy | Render.com (backend) · Vercel (frontend) |
| CI/CD | GitHub Actions — lint, typecheck, security scan, tests on every push |

---

## Architecture

```
backend/app/
  api/v1/endpoints/   — FastAPI routers (thin layer: validate → call service → return)
  models/             — SQLAlchemy ORM models (soft delete on all writable models)
  schemas/            — Pydantic v2 models (validation at the boundary)
  services/           — Business logic (ai_service, demo_service)
  core/               — Config, security, rate limiter, in-memory TTL cache
  db/                 — Engine, session factory, base class
```

**Key design decisions:**
- All DB aggregations happen in SQL (`func.sum(case(...))`) — no Python-side loops over rows
- Dashboard queries run concurrently via `asyncio.gather` — 8 independent queries fire simultaneously
- `selectinload()` on all relationships — no lazy loading in async context
- Indexes on every `user_id` FK and hot `WHERE` / `ORDER BY` column

---

## Running locally

**Backend**
```bash
cd backend
cp .env.example .env          # fill in DATABASE_URL, SECRET_KEY, GROQ_API_KEY
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
cp .env.example .env.local    # set NEXT_PUBLIC_API_URL
npm install
npm run dev
```

---

## CI/CD

Every push to `main` runs:

**Backend:** `ruff` → `mypy` → `bandit` → `pip-audit` → `pytest --cov`

**Frontend:** `eslint` → `tsc --noEmit` → `next build`

---

## Author

Built by [Devemite](https://devemite.vercel.app)
