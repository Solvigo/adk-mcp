from typing import List
from mcp.server.fastmcp import FastMCP
from .library import ADKLibrary

# Initiera biblioteket
# Notera: FastMCP kan startas via CLI entry point
library = ADKLibrary()
mcp = FastMCP("ADK Library")

@mcp.tool()
def list_topics() -> List[str]:
    """
    List all available topics/sections in the Google ADK documentation.
    Returns a list of header paths that can be used with read_topic.
    """
    return library.get_structure()

@mcp.tool()
def read_topic(topic: str) -> str:
    """
    Read the full content of a specific topic/section.
    
    Args:
        topic: The exact header path returned by list_topics (e.g. "Agent Development Kit (ADK) > 🚀 Installation").
    """
    return library.read_topic(topic)

@mcp.tool()
def search_adk(query: str) -> str:
    """
    Search the ADK documentation for keywords or concepts.
    Returns a formatted string with matching topics and snippets.
    
    Args:
        query: Search term (e.g. "best practices", "agent configuration")
    """
    results = library.search(query, limit=10)
    if not results:
        return "No results found."
    
    output = "Found the following relevant sections:\n\n"
    for r in results:
        output += f"--- Topic: {r['topic']} ---\n"
        output += f"{r['snippet']}\n\n"
        
    return output

def main():
    """Entry point för CLI."""
    mcp.run()

if __name__ == "__main__":
    main()

