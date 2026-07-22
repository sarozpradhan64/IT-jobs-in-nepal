# IT Jobs Aggregator Nepal - Useful Commands
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

# Run all portal and LinkedIn scrapers at once
python -m app.scrapers.run --source all

# Run a specific portal scraper
python -m app.scrapers.run --source merojob
python -m app.scrapers.run --source jobsnepal
python -m app.scrapers.run --source linkedin
```
