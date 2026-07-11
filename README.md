<div align="center">

# 🇳🇵 IT Jobs Nepal

**A comprehensive job aggregator platform for IT professionals in Nepal**

[![Daily Scrape](https://github.com/sarozpradhan64/IT-jobs-in-nepal/actions/workflows/daily-scrape.yml/badge.svg)](https://github.com/sarozpradhan64/IT-jobs-in-nepal/actions/workflows/daily-scrape.yml)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16%2B-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[API Docs](http://localhost:8000/docs) · [Report Bug](https://github.com/sarozpradhan64/IT-jobs-in-nepal/issues) · [Request Feature](https://github.com/sarozpradhan64/IT-jobs-in-nepal/issues)

</div>

---

## 📖 Overview

**IT Jobs Nepal** is an open-source job aggregator that automatically scrapes IT job listings from major Nepali job portals — MeroJob, JobsNepal, LinkedIn — and directly from company career pages. It exposes a clean REST API and a modern Next.js frontend, so developers, designers, and tech professionals in Nepal can discover all opportunities in one place.

### ✨ Key Features

- 🔍 **Multi-source scraping** — MeroJob, JobsNepal, LinkedIn, and 50+ company career pages
- ⚡ **Smart Career Page Engine** — Playwright-powered intelligent crawler that discovers job listings directly from company websites
- 🕐 **Daily automated scraping** via GitHub Actions (runs at midnight NPT every day)
- 🗄️ **SQLite / PostgreSQL** storage with full-text search support
- 📡 **FastAPI REST API** with interactive OpenAPI docs
- 🎨 **Modern Next.js 16 frontend** with TailwindCSS and React Query
- 🔄 **Alembic migrations** for schema version management

---

## 🏗️ Architecture

```
IT-jobs-in-nepal/
├── .github/
│   └── workflows/
│       └── daily-scrape.yml       # GitHub Actions — daily cron scraper
│
├── core/                          # Python backend (FastAPI)
│   ├── app/
│   │   ├── api/                   # REST API endpoints
│   │   │   ├── jobs.py            # Job listings endpoints
│   │   │   ├── companies.py       # Company endpoints
│   │   │   ├── stats.py           # Aggregated statistics
│   │   │   └── router.py          # API router
│   │   ├── scrapers/              # Scraping engines
│   │   │   ├── portals/
│   │   │   │   ├── merojob.py     # MeroJob-specific scraper
│   │   │   │   └── jobsnepal.py   # JobsNepal-specific scraper
│   │   │   ├── portal_engine.py   # Generic portal scraper (MeroJob, JobsNepal, LinkedIn)
│   │   │   ├── career_page.py     # Smart company career page crawler (Playwright)
│   │   │   ├── base.py            # Base scraper class
│   │   │   ├── constants.py       # IT keyword filter list
│   │   │   └── run.py             # CLI entry point
│   │   ├── services/
│   │   │   ├── github.py          # GitHub company list fetcher (mesaugat/tech-companies-in-nepal)
│   │   │   └── search_service.py  # Full-text search logic
│   │   ├── models.py              # SQLAlchemy ORM models
│   │   ├── database.py            # Async DB engine & session factory
│   │   ├── config.py              # Pydantic settings
│   │   └── schemas/               # Pydantic request/response schemas
│   ├── alembic/                   # Alembic migration scripts
│   ├── main.py                    # FastAPI application entry point
│   └── requirements.txt           # Python dependencies
│
└── frontend/                      # Next.js 16 frontend
    ├── src/
    │   ├── app/                   # Next.js App Router pages
    │   ├── components/            # Reusable UI components
    │   └── styles/                # Global CSS styles
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Python | 3.11+ |
| Node.js | 18+ |
| npm | 9+ |
| Git | any |

---

### 🐍 Backend Setup (FastAPI)

```bash
# 1. Clone the repository
git clone https://github.com/sarozpradhan64/IT-jobs-in-nepal.git
cd IT-jobs-in-nepal

# 2. Navigate to the backend directory
cd core

# 3. Create a virtual environment
python -m venv venv

# 4. Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# 5. Install Python dependencies
pip install -r requirements.txt

# 6. Install Playwright browser (required for the smart career page scraper)
playwright install chromium

# 7. Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section below)

# 8. Apply database migrations
alembic upgrade head

# 9. Start the development server
uvicorn main:app --reload --port 8000
```

✅ The API will be live at **http://localhost:8000**  
📄 Interactive Swagger UI at **http://localhost:8000/docs**

---

### 🌐 Frontend Setup (Next.js)

```bash
# From the project root, navigate to the frontend
cd frontend

# Install Node dependencies
npm install

# Set up environment variables
# Create frontend/.env.local and add:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

✅ The frontend will be live at **http://localhost:3000**

---

## ⚙️ Environment Variables

### Backend — `core/.env`

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `DATABASE_URL` | `sqlite+aiosqlite:///./it_jobs_nepal.db` | ✅ | Async SQLAlchemy database URL |
| `SYNC_DATABASE_URL` | `sqlite:///./it_jobs_nepal.db` | ✅ | Sync URL used by Alembic for migrations |
| `CACHE_DB_URL` | `sqlite+aiosqlite:///./cache.db` | ✅ | Transient scraper result cache |

### Frontend — `frontend/.env.local`

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API base URL |

---

## 🕷️ Running Scrapers

All scraper commands must be run from the `core/` directory with the virtual environment activated.

```bash
cd core

# Activate venv — Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### Portal Scrapers

These scrapers search job portals by IT keyword and save results to the database.

```bash
# Run ALL portal scrapers at once (MeroJob + JobsNepal + LinkedIn)
python -m app.scrapers.run --source all

# Run a specific portal scraper
python -m app.scrapers.run --source merojob
python -m app.scrapers.run --source jobsnepal
python -m app.scrapers.run --source linkedin
```

### Smart Career Page Crawler

The smart crawler fetches the company registry from the public [mesaugat/tech-companies-in-nepal](https://github.com/mesaugat/tech-companies-in-nepal) GitHub README and directly visits each company's careers page using Playwright.

```bash
# Run the career page crawler only (no portal scraping)
python -m app.scrapers.run --source none --github-companies

# Run EVERYTHING: all portals AND the career page crawler
python -m app.scrapers.run --source all --github-companies

# Dev mode — stops after scraping 5 companies with jobs (fast testing)
python -m app.scrapers.run --source all --github-companies --dev
```

### Available Scraper Options

| Flag | Description |
|------|-------------|
| `--source <name>` | Portal to scrape: `merojob`, `jobsnepal`, `linkedin`, `all`, `none` |
| `--github-companies` | Also run the smart career page crawler |
| `--dev` | Dev mode — cap at 5 companies with jobs for quick testing |

### IT Keyword Filters

Scrapers automatically filter results to IT-relevant roles using keywords from `core/app/scrapers/constants.py`:

```
software engineer · software developer · frontend developer · backend developer
fullstack developer · devops · data engineer · machine learning · python developer
react developer · android developer · ios developer · qa engineer · ui ux designer · product manager
```

---

## 📡 API Reference

**Base URL:** `http://localhost:8000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs` | List all job listings (supports filters/pagination) |
| `GET` | `/api/jobs/{id}` | Get a single job by ID |
| `GET` | `/api/companies` | List all tracked companies |
| `GET` | `/api/stats` | Aggregated stats (total jobs, companies, portals) |
| `GET` | `/` | API health check |

> Full interactive docs with request/response schemas: **http://localhost:8000/docs**

---

## 🗄️ Database

The project defaults to **SQLite** (zero-config, works locally and in CI). Switch to PostgreSQL for production by updating `DATABASE_URL` in `.env`.

### Schema Overview

```
Company ──< Job >── ScraperSource
             │
          job_skills (association)
             │
           Skill
```

| Table | Description |
|-------|-------------|
| `companies` | Tracked companies with website/career page links |
| `jobs` | Scraped job listings with title, location, type, salary, etc. |
| `scraper_sources` | Registered scrapers (merojob, jobsnepal, linkedin) |
| `skills` | Normalized skill tags |
| `job_skills` | Many-to-many job ↔ skill associations |

### Database Migrations (Alembic)

```bash
cd core
# Make sure venv is activated

# After modifying models.py, create a new migration
alembic revision --autogenerate -m "describe your change"

# Apply all pending migrations
alembic upgrade head

# Roll back one migration
alembic downgrade -1

# View migration history
alembic history
```

---

## ⏰ GitHub Actions — Daily Automated Scraping

The workflow at `.github/workflows/daily-scrape.yml`:

- ⏰ Runs automatically **every day at 18:15 UTC (midnight NPT — Nepal Time)**
- 🕷️ Executes `python -m app.scrapers.run --source all` to scrape all portals
- 💾 Commits the updated `it_jobs_nepal.db` back to the repository
- 🖱️ Can also be triggered **manually** at any time from the GitHub Actions tab

### Setup

1. **Push** the repository to GitHub
2. The workflow file `.github/workflows/daily-scrape.yml` will be picked up automatically
3. **No secrets required** — the company list is fetched from the public GitHub README at [mesaugat/tech-companies-in-nepal](https://github.com/mesaugat/tech-companies-in-nepal)

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get started:

1. **Fork** this repository
2. **Create** a feature branch: `git checkout -b feat/your-feature-name`
3. **Make** your changes
4. **Commit** with a descriptive message: `git commit -m "feat: add your feature"`
5. **Push** to your fork: `git push origin feat/your-feature-name`
6. **Open** a Pull Request against `main`

### Adding a New Portal Scraper

1. Add a new portal config block to `PORTAL_CONFIGS` in `core/app/scrapers/portal_engine.py`
2. Set the appropriate CSS selectors for that portal's HTML structure
3. Test it locally: `python -m app.scrapers.run --source your_portal_name`

### Adding a Company to the Career Page Crawler

Open a PR adding the company (name + website) to the [mesaugat/tech-companies-in-nepal](https://github.com/mesaugat/tech-companies-in-nepal) repository, or raise an issue here with the details.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [MeroJob](https://merojob.com) — Nepal's leading job portal
- [JobsNepal](https://www.jobsnepal.com) — Nepali job listings platform
- [LinkedIn Jobs](https://www.linkedin.com/jobs) — Professional network job board
- [FastAPI](https://fastapi.tiangolo.com) — Modern, high-performance Python web framework
- [Playwright](https://playwright.dev) — Reliable browser automation for smart scraping
- [Next.js](https://nextjs.org) — The React framework for production

---

<div align="center">
Made with ❤️ for the Nepali tech community
</div>