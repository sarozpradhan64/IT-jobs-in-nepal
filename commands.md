# IT Jobs Aggregator Nepal - Useful Commands

*(All commands run from the `core/` directory with venv activated)*

```bash
# Activate venv — Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

## Backend

```bash
uvicorn main:app --reload --port 8000
```

## Database (Alembic)

```bash
# Create migration after modifying models.py
alembic revision --autogenerate -m "describe your change"

# Apply migrations
alembic upgrade head

# Roll back one migration
alembic downgrade -1

# View history
alembic history
```

## Scrapers

```bash
# All portals (MeroJob + JobsNepal + LinkedIn)
python -m app.scrapers.run --source all

# Specific portal
python -m app.scrapers.run --source merojob
python -m app.scrapers.run --source jobsnepal
python -m app.scrapers.run --source linkedin

# Career page crawler only (no portals)
python -m app.scrapers.run --source none --github-companies

# Everything: all portals + career page crawler
python -m app.scrapers.run --source all --github-companies

# Dev mode — stops after 5 companies with jobs
python -m app.scrapers.run --source all --github-companies --dev
```

## Frontend

```bash
# From project root
cd frontend
npm install
npm run dev   # http://localhost:3000
```
