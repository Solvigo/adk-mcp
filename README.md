# ADK Documentation MCP Server

En MCP (Model Context Protocol) server som ger din AI-assistent tillgång till Google Agent Development Kit (ADK) dokumentation.

## 🚀 Snabbinstallation (npx)

Du kan köra servern direkt från GitHub utan att ladda ner något manuellt.

Lägg till detta i din `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "adk-docs": {
      "command": "npx",
      "args": [
        "-y",
        "github:Solvigo/adk-mcp"
      ]
    }
  }
}
```

Starta om Claude Desktop, och du är klar!

## Funktioner

*   `list_topics()`: Navigera i dokumentationen.
*   `read_topic(topic)`: Läs specifika avsnitt.
*   `search_adk(query)`: Sök efter information.

## Utveckling / Lokal Körning

Om du vill bidra eller köra lokalt:

1.  Klona repot: `git clone https://github.com/Solvigo/adk-mcp.git`
2.  Installera: `npm install`
3.  Bygg: `npm run build`
4.  Kör: `npm start`
