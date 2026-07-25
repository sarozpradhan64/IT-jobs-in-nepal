"""
Category Classifier Service
============================
Classifies a job listing into one of the predefined IT categories
by matching category keywords against the job's text fields.

Algorithm
---------
1. Build a single lowercased text corpus from title + description +
   requirements + responsibilities.
2. For each category, count:
   - total_occurrences: sum of how many times each keyword appears in
     the corpus (allows a keyword to score > 1 if it repeats).
   - unique_matches: count of distinct keywords that match at least once.
3. Pick the category with the highest total_occurrences.
4. Tie-break 1: most unique_matches.
5. Tie-break 2: (already resolved by total_occurrences being the primary key)
6. Fallback: if nothing matches, return the "other" category.

Matching
--------
- Case-insensitive.
- Multi-word keywords are matched as literal phrases.
- Single-word keywords are matched as whole words (word-boundary anchors)
  to avoid e.g. "css" matching inside "accessibility".
- Duplicate keyword hits in the corpus count separately (frequency scoring).
"""

from __future__ import annotations

import re
import logging
from typing import Dict, List, Optional, Tuple

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

log = logging.getLogger(__name__)


class CategoryClassifier:
    """
    Reusable classifier loaded once per session.

    Usage::

        classifier = await CategoryClassifier.load(db)
        category_id = classifier.classify(
            title="Senior React Developer",
            description="We are looking for a React / Next.js expert ...",
        )
    """

    def __init__(
        self,
        category_data: List[Dict],  # [{id, slug, keywords: [str]}]
        fallback_id: Optional[int],
    ) -> None:
        self._categories = category_data
        self._fallback_id = fallback_id
        # Pre-compile regex patterns for every keyword once
        self._patterns: Dict[int, List[Tuple[str, re.Pattern]]] = {}
        for cat in self._categories:
            patterns: List[Tuple[str, re.Pattern]] = []
            for kw in cat["keywords"]:
                kw_lower = kw.lower()
                if " " in kw_lower:
                    # Multi-word: literal phrase match
                    pattern = re.compile(re.escape(kw_lower), re.IGNORECASE)
                else:
                    # Single-word: whole-word match
                    pattern = re.compile(
                        r"(?<![a-z0-9])" + re.escape(kw_lower) + r"(?![a-z0-9])",
                        re.IGNORECASE,
                    )
                patterns.append((kw_lower, pattern))
            self._patterns[cat["id"]] = patterns

    # ------------------------------------------------------------------
    # Factory
    # ------------------------------------------------------------------
    @classmethod
    async def load(cls, db: AsyncSession) -> "CategoryClassifier":
        """
        Load all categories and their keywords from the database.
        Returns a ready-to-use CategoryClassifier instance.
        """
        from app.models import Category  # local import to avoid circular deps

        result = await db.execute(
            select(Category).options(selectinload(Category.keywords))
        )
        categories = result.scalars().all()

        category_data: List[Dict] = []
        fallback_id: Optional[int] = None

        for cat in categories:
            kws = [kw.keyword for kw in cat.keywords]
            category_data.append({"id": cat.id, "slug": cat.slug, "keywords": kws})
            if cat.slug == "other":
                fallback_id = cat.id

        return cls(category_data, fallback_id)

    # ------------------------------------------------------------------
    # Core classification
    # ------------------------------------------------------------------
    def classify(
        self,
        title: str = "",
        description: str = "",
        requirements: str = "",
        responsibilities: str = "",
    ) -> Optional[int]:
        """
        Return the best-matching category_id, or the 'other' category_id
        if nothing matches. Returns None only when no categories exist at all.
        """
        corpus = " ".join(
            filter(None, [title, description, requirements, responsibilities])
        ).lower()

        if not corpus.strip():
            return self._fallback_id

        best_id: Optional[int] = None
        best_occurrences: int = 0
        best_unique: int = 0

        for cat in self._categories:
            if cat["slug"] == "other":
                continue  # skip fallback from normal scoring

            patterns = self._patterns.get(cat["id"], [])
            if not patterns:
                continue

            total_occurrences = 0
            unique_matches = 0

            for _kw, pattern in patterns:
                matches = pattern.findall(corpus)
                count = len(matches)
                if count > 0:
                    total_occurrences += count
                    unique_matches += 1

            if total_occurrences == 0:
                continue

            # Pick winner: most occurrences, then most unique matches
            if (
                total_occurrences > best_occurrences
                or (
                    total_occurrences == best_occurrences
                    and unique_matches > best_unique
                )
            ):
                best_occurrences = total_occurrences
                best_unique = unique_matches
                best_id = cat["id"]

        if best_id is None:
            log.debug("No keyword matches — assigning fallback (other) category.")
            return self._fallback_id

        return best_id
