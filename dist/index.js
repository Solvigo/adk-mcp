#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { ADKLibrary } from "./library.js";
// Initialize library
const library = new ADKLibrary();
// Create server instance
const server = new Server({
    name: "adk-docs",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "list_topics",
                description: "List all available topics/sections in the Google ADK documentation. Returns a list of header paths that can be used with read_topic.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "read_topic",
                description: "Read the full content of a specific topic/section.",
                inputSchema: {
                    type: "object",
                    properties: {
                        topic: {
                            type: "string",
                            description: "The exact header path returned by list_topics (e.g. 'Agent Development Kit (ADK) > 🚀 Installation').",
                        },
                    },
                    required: ["topic"],
                },
            },
            {
                name: "search_adk",
                description: "Search the ADK documentation for keywords or concepts. Returns a formatted string with matching topics and snippets.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Search term (e.g. 'best practices', 'agent configuration')",
                        },
                    },
                    required: ["query"],
                },
            },
        ],
    };
});
// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (name === "list_topics") {
            const topics = library.getStructure();
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(topics, null, 2),
                    },
                ],
            };
        }
        if (name === "read_topic") {
            const { topic } = z
                .object({ topic: z.string() })
                .parse(args);
            const content = library.readTopic(topic);
            return {
                content: [
                    {
                        type: "text",
                        text: content,
                    },
                ],
            };
        }
        if (name === "search_adk") {
            const { query } = z
                .object({ query: z.string() })
                .parse(args);
            const results = library.search(query, 10);
            if (results.length === 0) {
                return {
                    content: [{ type: "text", text: "No results found." }],
                };
            }
            let output = "Found the following relevant sections:\n\n";
            for (const r of results) {
                output += `--- Topic: ${r.topic} ---\n`;
                output += `${r.snippet}\n\n`;
            }
            return {
                content: [{ type: "text", text: output }],
            };
        }
        throw new Error(`Unknown tool: ${name}`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: "text", text: `Error: ${errorMessage}` }],
            isError: true,
        };
    }
});
// Start the server
async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("ADK MCP Server running on stdio");
}
runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
