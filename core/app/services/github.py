import logging
import re
import httpx
from typing import List, Dict, Any
from urllib.parse import urlparse

log = logging.getLogger(__name__)

class GitHubClient:
    def __init__(self):
        self.readme_url = "https://raw.githubusercontent.com/mesaugat/tech-companies-in-nepal/master/README.md"

    async def get_companies(self) -> List[Dict[str, Any]]:
        """
        Fetch the list of IT companies from the mesaugat/tech-companies-in-nepal GitHub README.
        Returns a list of dicts with keys: 'name', 'website', 'careers_url'.
        """
        log.info(f"Fetching companies from GitHub Repo: {self.readme_url}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(self.readme_url)
            response.raise_for_status()
            content = response.text
            
        companies = []
        # Format: - [Company Name](https://my.company) | location, city | what does it do
        # We use a regex to extract the name and website.
        pattern = re.compile(r'^\s*-\s*\[([^\]]+)\]\(([^)]+)\)\s*\|', re.MULTILINE)
        
        SKIP_DOMAINS = {"my.company", "example.com", "localhost", "yourdomain.com"}

        for match in pattern.finditer(content):
            name = match.group(1).strip()
            website = match.group(2).strip()

            domain = urlparse(website).netloc.lower().lstrip("www.")
            if domain in SKIP_DOMAINS:
                continue

            companies.append({
                "name": name,
                "website": website,
                "careers_url": None
            })
            
        log.info(f"Successfully parsed {len(companies)} companies from GitHub README.")
        return companies
