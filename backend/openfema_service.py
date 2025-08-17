import aiohttp
import asyncio
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any

OPENFEMA_BASE = "https://www.fema.gov/api/open/v2"

@dataclass
class FEMADeclaration:
    id: str
    disasterNumber: int
    declarationDate: str
    state: str
    incidentType: str
    declarationType: Optional[str]
    title: Optional[str]
    county: Optional[str]
    placeCode: Optional[str]
    femaRegion: Optional[str]
    incidentBeginDate: Optional[str]
    incidentEndDate: Optional[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

class OpenFEMAService:
    async def _fetch(self, session: aiohttp.ClientSession, url: str) -> Dict[str, Any]:
        async with session.get(url, timeout=30) as resp:
            resp.raise_for_status()
            return await resp.json()

    async def fetch_recent_disasters(self, days: int = 14, state: Optional[str] = None, top: int = 200) -> List[FEMADeclaration]:
        since = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
        # Build $filter for declarationDate and optional state
        filters = [f"declarationDate ge '{since}'"]
        if state:
            filters.append(f"state eq '{state.upper()}'")
        filter_q = " and ".join(filters)
        url = (
            f"{OPENFEMA_BASE}/DisasterDeclarationsSummaries?"
            f"$filter={filter_q}&$orderby=declarationDate desc&$top={top}"
        )
        async with aiohttp.ClientSession() as session:
            data = await self._fetch(session, url)
            items = data.get("DisasterDeclarationsSummaries", [])
            results: List[FEMADeclaration] = []
            for itm in items:
                try:
                    results.append(
                        FEMADeclaration(
                            id=str(itm.get("id") or itm.get("disasterNumber")),
                            disasterNumber=int(itm.get("disasterNumber")),
                            declarationDate=str(itm.get("declarationDate")),
                            state=str(itm.get("state")),
                            incidentType=str(itm.get("incidentType")),
                            declarationType=itm.get("declarationType"),
                            title=itm.get("title") or itm.get("incidentType"),
                            county=itm.get("declaredCountyArea"),
                            placeCode=str(itm.get("placeCode")) if itm.get("placeCode") is not None else None,
                            femaRegion=str(itm.get("femaRegion")) if itm.get("femaRegion") is not None else None,
                            incidentBeginDate=str(itm.get("incidentBeginDate")) if itm.get("incidentBeginDate") else None,
                            incidentEndDate=str(itm.get("incidentEndDate")) if itm.get("incidentEndDate") else None,
                        )
                    )
                except Exception:
                    # Skip malformed items
                    continue
            return results

# Singleton
openfema_service = OpenFEMAService()
