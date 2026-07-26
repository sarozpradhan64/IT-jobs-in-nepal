import json
from pathlib import Path
from fastapi import APIRouter, HTTPException

router = APIRouter()

LOGS_DIR = Path(__file__).resolve().parents[3] / "logs"


@router.get("/")
async def list_runs():
    """Return a summary list of all scrape runs (newest first)."""
    if not LOGS_DIR.exists():
        return []
    runs = []
    for f in sorted(LOGS_DIR.glob("scrape_*.json"), reverse=True):
        try:
            failures = json.loads(f.read_text(encoding="utf-8"))
            runs.append({"run": f.stem, "failed_count": len(failures)})
        except Exception:
            continue
    return runs


@router.get("/{run}")
async def get_run(run: str):
    """Return all failure entries for a specific run."""
    log_file = LOGS_DIR / f"{run}.json"
    if not log_file.exists():
        raise HTTPException(status_code=404, detail="Run not found")
    return json.loads(log_file.read_text(encoding="utf-8"))
