"""
Scraper CLI entry point.

Usage (from the `core/` directory with venv activated):
    python -m app.scrapers.run --source all
    python -m app.scrapers.run --source merojob
    python -m app.scrapers.run --source jobsnepal
"""
import asyncio
import argparse
import json
import logging
from datetime import datetime
from pathlib import Path
from app.database import SessionLocal, engine, Base
from app.scrapers.portal_engine import SmartPortalScraper, PORTAL_CONFIGS
from app.scrapers.career_page import SmartCareerScraper
from app.services.github import GitHubClient
from tqdm import tqdm

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
log = logging.getLogger("scraper_runner")

# Suppress verbose logs so the progress bar renders cleanly
logging.getLogger("app.scrapers.career_page").setLevel(logging.WARNING)
logging.getLogger("httpx").setLevel(logging.WARNING)

LOGS_DIR = Path(__file__).resolve().parents[3] / "logs"


def _append_failure(log_file: Path, source: str, source_type: str, error: str) -> None:
    """Append a failure entry to the run's JSON log file."""
    entry = {
        "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": source,
        "source_type": source_type,
        "error": error,
    }
    existing: list = json.loads(log_file.read_text(encoding="utf-8")) if log_file.exists() else []
    existing.append(entry)
    log_file.write_text(json.dumps(existing, indent=2), encoding="utf-8")

SCRAPERS = {
    portal: (lambda p=portal: SmartPortalScraper(p))
    for portal in PORTAL_CONFIGS
}


async def run_smart_crawlers(dev_mode: bool = False, log_file: Path | None = None) -> None:
    """Fetch companies from GitHub and run Smart Engine on each."""
    log.info("Fetching companies from GitHub...")
    DEV_COMPANY_LIMIT = 5
    try:
        client = GitHubClient()
        companies = await client.get_companies()
    except Exception as e:
        log.error(f"Failed to fetch from GitHub: {e}")
        if log_file:
            _append_failure(log_file, "github", "career_page", str(e))
        return

    total_jobs_found = 0
    companies_with_jobs = 0
    pbar = tqdm(companies, desc="Scraping Companies", unit="company")
    
    for comp in pbar:
        name = comp["name"]
        url = comp["careers_url"] or comp["website"]  # noqa: F841 (used below)
        
        pbar.set_postfix({"company": name[:15], "total_jobs": total_jobs_found})
        
        if not url:
            continue
            
        try:
            async with SessionLocal() as db:
                scraper = SmartCareerScraper(company_name=name, base_url=url)
                jobs = await scraper.run_smart_engine()
                if jobs:
                    await scraper.save(db, jobs)
                    await db.commit()
                    total_jobs_found += len(jobs)
                    companies_with_jobs += 1
                    pbar.set_postfix({"company": name[:15], "total_jobs": total_jobs_found})
                    
                    if dev_mode and companies_with_jobs >= DEV_COMPANY_LIMIT:
                        tqdm.write(f"[DEV MODE] Reached {DEV_COMPANY_LIMIT} companies with jobs. Stopping early.")
                        break
        except Exception as e:
            if log_file:
                _append_failure(log_file, name, "career_page", str(e))

    print(f"\n[DONE] Scraped {companies_with_jobs} companies with a total of {total_jobs_found} IT jobs.")
    if dev_mode:
        print(f"       (Dev mode -- capped at {DEV_COMPANY_LIMIT} companies with jobs)")

async def run_scraper(source: str, github: bool = False, dev_mode: bool = False) -> None:
    # Ensure tables exist (creates SQLite DB file if missing)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    LOGS_DIR.mkdir(exist_ok=True)
    run_ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    log_file = LOGS_DIR / f"scrape_{run_ts}.json"

    if source == "all":
        targets = SCRAPERS
    elif source == "none":
        targets = {}
    else:
        targets = {source: SCRAPERS[source]}

    for name, ScraperClass in targets.items():
        log.info(f"Starting scraper: {name}")
        try:
            async with SessionLocal() as db:
                scraper = ScraperClass()
                await scraper.run(db)
                await db.commit()
            log.info(f"Finished scraper: {name}")
        except Exception as e:
            log.error(f"Scraper '{name}' failed: {e}", exc_info=True)
            _append_failure(log_file, name, "portal", str(e))

    if github:
        await run_smart_crawlers(dev_mode=dev_mode, log_file=log_file)


def main() -> None:
    parser = argparse.ArgumentParser(description="IT Jobs Nepal — Manual Scraper Runner")
    parser.add_argument(
        "--source",
        choices=list(SCRAPERS.keys()) + ["all", "none"],
        default="none",
        help="Which generic portal scraper to run (default: none)",
    )
    parser.add_argument(
        "--github-companies",
        action="store_true",
        help="Fetch companies from GitHub Repo and run the Smart Engine crawler on each",
    )
    parser.add_argument(
        "--dev",
        action="store_true",
        help="Dev mode: stop after scraping 5 companies with jobs (for testing)",
    )
    args = parser.parse_args()

    if args.source != "none" and args.source != "all" and args.source not in SCRAPERS:
        parser.error(f"Unknown source '{args.source}'. Available: {', '.join(SCRAPERS)}")

    asyncio.run(run_scraper(args.source, args.github_companies, args.dev))


if __name__ == "__main__":
    main()
