# ADK Documentation MCP Server

Detta är en lokal MCP (Model Context Protocol) server som ger din AI-assistent (t.ex. Claude eller Cursor) tillgång till Google Agent Development Kit (ADK) dokumentation.

## Innehåll
- **Sök**: Hitta relevanta sektioner baserat på nyckelord.
- **Läs**: Hämta fullständigt innehåll från specifika kapitel.
- **Navigera**: Se dokumentets struktur.

## Installation

### Alternativ 1: Snabbstart (Mac/Linux)

1. Se till att du har Python 3.10+ installerat.
2. Klona detta repo eller ladda ner filerna.
3. Kör följande kommandon i terminalen:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Alternativ 2: Konfiguration i Claude Desktop / Cursor

Lägg till följande i din konfigurationsfil (t.ex. `claude_desktop_config.json` eller via Settings i Cursor):

**Viktigt:** Byt ut `/ABSOLUTE/PATH/TO/THIS/FOLDER` mot den faktiska sökvägen där du sparade filerna.

```json
{
  "mcpServers": {
    "adk-docs": {
      "command": "/ABSOLUTE/PATH/TO/THIS/FOLDER/.venv/bin/python",
      "args": [
        "/ABSOLUTE/PATH/TO/THIS/FOLDER/adk_mcp_server.py"
      ]
    }
  }
}
```

## Användning

När servern är tillagd kan du fråga din AI:
- "Hur installerar jag ADK?"
- "Vad är best practices för agenter?"
- "Visa strukturen på dokumentationen."

Servern kommer automatiskt att söka i `adk_chunks.jsonl` och ge svar.

