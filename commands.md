# IT Jobs Aggregator Nepal - Useful Commands

## Frontend (Next.js)

```bash
# Navigate to frontend
cd frontend

# Install dependencies (Required after updating package.json)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Backend (FastAPI)

```bash
# Navigate to core (backend)
cd core

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI development server
uvicorn main:app --reload --port 8000
```

## Database (Alembic Migrations)

*(Make sure you are in the `core` directory and virtual environment is activated)*

```bash
# Initialize Alembic (if not already done)
alembic init alembic

# Create a new migration revision after modifying models.py
alembic revision --autogenerate -m "Initial migration"

# Apply migrations to the database
alembic upgrade head
```

## Running Scrapers

```bash
# Activate the venv first (Windows)
venv/Scripts/activate

# Run all scrapers
python -m app.scrapers.run --source all

# Run a specific scraper
python -m app.scrapers.run --source merojob
python -m app.scrapers.run --source jobsnepal
```

## Docker (When configured)

```bash
# Build and start all services (frontend, backend, postgres)
docker-compose up -d --build

# Stop all services
docker-compose down
```
