# HustleOS

HustleOS is a life-tracking web application that brings together key productivity areas in one place: **goals**, **finances**, **health**, and **career**. The project uses AI for convenient natural language data entry.

---

## 🚀 Live Links

* **Frontend App:** [https://hustle-app-theta.vercel.app/](https://hustle-app-theta.vercel.app/)
* **Backend API Docs:** [https://backend-hustle-app.onrender.com/docs](https://backend-hustle-app.onrender.com/docs)

---

## ✨ Key Features

### Authentication
* **Registration and login** via email/password (OAuth2 password flow).
* **Demo mode**: Login to a demonstration account with demo data reset upon each login.

### Dashboard
A consolidated "for today" view that aggregates:
* Tasks and habits
* Balance and recent expenses
* Meals and macronutrients
* Latest job offers

### Finances
* Review and delete transactions (expenses).
* **Hustle Input**: Add a transaction with a single sentence (AI extracts the amount, category, and description).

### Health
* **AI Meal Logger**: Log a meal from a simple description (AI extracts calories and macros).
* Review and delete meals.

### Career
* Track job offers, update statuses, add notes, and delete offers.

---

## 🛠 Tech Stack

* **Frontend**: Next.js (App Router), React, TypeScript, TanStack React Query, Tailwind CSS, shadcn/ui
* **Backend**: FastAPI, async SQLAlchemy, Alembic, PostgreSQL
* **AI**: Groq (natural language parsing for finances and health)
* **Deployment**: Vercel (Frontend), Render (Backend)

---

## 🔒 Security and Architecture

* Authorization is based on **JWT in an HttpOnly cookie**, making the token inaccessible from JavaScript (protection against XSS attacks).
* Unauthenticated users are strictly redirected from protected routes (dashboard, goals, finances, health, career).

---

## 👤 Author

Built by **Devemite** – [https://devemite.vercel.app/](https://devemite.vercel.app/)
