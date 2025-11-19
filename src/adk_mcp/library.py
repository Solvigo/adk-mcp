import importlib.resources
import json
from typing import List, Dict, Any
import logging
import os

logger = logging.getLogger(__name__)

class ADKLibrary:
    def __init__(self, data_path: str = None):
        self.chunks = []
        self.header_map = {}
        
        if data_path:
             self.data_path = data_path
        else:
            # Använd importlib för att hitta data-filen korrekt inuti paketet
            try:
                # Python 3.9+ stil
                files = importlib.resources.files("adk_mcp.data")
                self.data_path = str(files.joinpath("adk_chunks.jsonl"))
            except Exception:
                # Fallback för äldre system eller om paketet körs direkt från källkod utan installation
                base_dir = os.path.dirname(os.path.abspath(__file__))
                self.data_path = os.path.join(base_dir, "data", "adk_chunks.jsonl")

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
            pass

    def get_structure(self) -> List[str]:
        """Returnerar en lista av alla rubriker (topics)."""
        return sorted(list(self.header_map.keys()))

    def read_topic(self, topic: str) -> str:
        """Läser allt innehåll för en specifik rubrik."""
        if topic not in self.header_map:
            return f"Error: Topic '{topic}' not found."
        
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
                })
        return results[:limit]

