# ADK Documentation MCP Server

En MCP (Model Context Protocol) server som ger din AI-assistent tillgång till Google Agent Development Kit (ADK) dokumentation.

## Installation

Det enklaste sättet att använda denna server är med `uv` (en snabb Python-pakethanterare).

### Alternativ 1: Direkt via Claude Desktop

Lägg till detta i din `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "adk-docs": {
      "command": "uv",
      "args": [
        "tool",
        "run",
        "--from",
        "git+https://github.com/Solvigo/adk-mcp.git",
        "adk-mcp"
      ]
    }
  }
}
```

### Alternativ 2: Installera lokalt (pip)

Om du vill installera paketet i din miljö:

```bash
pip install git+https://github.com/Solvigo/adk-mcp.git
```

Sedan kan du köra servern med:

```bash
adk-mcp
```

## Utveckling

1. Klona repot
2. Installera beroenden: `uv sync` eller `pip install -e .`
3. Kör: `adk-mcp`

## Funktioner

*   `list_topics()`: Navigera i dokumentationen.
*   `read_topic(topic)`: Läs specifika avsnitt.
*   `search_adk(query)`: Sök efter information.
