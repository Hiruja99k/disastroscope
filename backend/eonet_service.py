import aiohttp
from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional
from datetime import datetime

EONET_BASE = "https://eonet.gsfc.nasa.gov/api/v3"

@dataclass
class EONETEvent:
    id: str
    title: str
    status: str
    link: Optional[str]
    categories: List[Dict[str, Any]]
    geometry: List[Dict[str, Any]]
    sources: List[Dict[str, Any]]
    closed: Optional[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

class EONETService:
    async def _fetch(self, session: aiohttp.ClientSession, url: str) -> Dict[str, Any]:
        async with session.get(url, timeout=30) as resp:
            resp.raise_for_status()
            return await resp.json()

    async def fetch_events(self, status: str = "open", limit: int = 200, days: Optional[int] = None, category: Optional[str] = None) -> List[EONETEvent]:
        params = [f"status={status}", f"limit={limit}"]
        if days is not None:
            params.append(f"days={days}")
        if category:
            params.append(f"category={category}")
        url = f"{EONET_BASE}/events?" + "&".join(params)
        async with aiohttp.ClientSession() as session:
            data = await self._fetch(session, url)
            items = data.get("events", [])
            results: List[EONETEvent] = []
            for ev in items:
                try:
                    results.append(
                        EONETEvent(
                            id=str(ev.get("id")),
                            title=str(ev.get("title")),
                            status=str(ev.get("status")),
                            link=ev.get("link"),
                            categories=ev.get("categories", []),
                            geometry=ev.get("geometry", []),
                            sources=ev.get("sources", []),
                            closed=ev.get("closed")
                        )
                    )
                except Exception:
                    continue
            return results

# Singleton
eonet_service = EONETService()
