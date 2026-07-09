import logging
from typing import List, Dict, Any
from pyairtable import Api

from app.config import settings

log = logging.getLogger(__name__)

class AirtableClient:
    def __init__(self):
        if not settings.AIRTABLE_API_KEY:
            raise ValueError("AIRTABLE_API_KEY is not set in environment or .env file")
        
        self.api = Api(settings.AIRTABLE_API_KEY)
        self.table = self.api.table(
            settings.AIRTABLE_BASE_ID, 
            settings.AIRTABLE_TABLE_NAME
        )

    def get_companies(self) -> List[Dict[str, Any]]:
        """
        Fetch the list of IT companies from Airtable.
        Returns a list of dicts with normalized keys: 'name', 'website', 'careers_url'.
        """
        log.info(f"Fetching companies from Airtable Base: {settings.AIRTABLE_BASE_ID}")
        records = self.table.all()
        
        companies = []
        for r in records:
            fields = r.get("fields", {})
            
            # Since we don't know the exact column names yet, we use a heuristic 
            # to find the Name, Website, and Careers URL columns.
            name = None
            website = None
            careers_url = None
            
            for key, val in fields.items():
                if not isinstance(val, str):
                    continue
                
                k = key.lower()
                if "name" in k or "company" in k:
                    if not name: name = val
                elif "career" in k or "job" in k or "opening" in k:
                    if not careers_url and val.startswith("http"):
                        careers_url = val
                elif "website" in k or "url" in k or "link" in k:
                    if not website and val.startswith("http"):
                        website = val
            
            # If name is still none, just grab the first string field
            if not name:
                for val in fields.values():
                    if isinstance(val, str):
                        name = val
                        break
                        
            if name:
                companies.append({
                    "name": name.strip(),
                    "website": website.strip() if website else None,
                    "careers_url": careers_url.strip() if careers_url else None
                })
                
        log.info(f"Successfully fetched {len(companies)} companies from Airtable.")
        return companies
