import json
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class ADKLibrary:
    def __init__(self, data_path: str = "adk_chunks.jsonl"):
        self.chunks = []
        self.header_map = {}
        self.data_path = data_path
        self._load_data()

    def _load_data(self):
        try:
            with open(self.data_path, 'r', encoding='utf-8') as f:
                for line in f:
                    try:
                        chunk = json.loads(line)
                        self.chunks.append(chunk)
                        path = chunk.get('header_path', 'Unknown')
                        if path not in self.header_map:
                            self.header_map[path] = []
                        self.header_map[path].append(chunk)
                    except json.JSONDecodeError:
                        logger.warning("Kunde inte avkoda en rad i JSONL-filen.")
        except FileNotFoundError:
            logger.error(f"Filen {self.data_path} hittades inte.")
            # Hantera fallet om filen inte finns än (t.ex. vid init)
            pass

    def get_structure(self) -> List[str]:
        """Returnerar en lista av alla rubriker (topics)."""
        return sorted(list(self.header_map.keys()))

    def read_topic(self, topic: str) -> str:
        """Läser allt innehåll för en specifik rubrik."""
        if topic not in self.header_map:
            return f"Error: Topic '{topic}' not found."
        
        # Sortera chunks om det behövs, men de ligger oftast i ordning i filen
        # Vi returnerar texten
        return "\n\n".join([c['text'] for c in self.header_map[topic]])

    def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Enkel fritextsökning."""
        results = []
        query_lower = query.lower()
        for chunk in self.chunks:
            if query_lower in chunk['text'].lower() or query_lower in chunk['header_path'].lower():
                results.append({
                    "topic": chunk['header_path'],
                    "snippet": chunk['text'][:300] + "..." if len(chunk['text']) > 300 else chunk['text'],
                    # Vi inkluderar inte full text här för att spara tokens vid söklistning
                })
        return results[:limit]

