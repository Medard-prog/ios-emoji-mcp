#!/usr/bin/env node

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { 
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError 
} = require("@modelcontextprotocol/sdk/types.js");

const server = new Server(
  {
    name: "ios-emoji-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "hello_world",
        description: "Returns a simple hello world greeting",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name to greet (optional)",
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "hello_world") {
    const name = request.params.arguments?.name || "World";
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${name}! This is the iOS Emoji MCP server.`,
        },
      ],
    };
  }
  
  throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("iOS Emoji MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});