#!/usr/bin/env node

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { 
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError 
} = require("@modelcontextprotocol/sdk/types.js");
const fs = require("fs");
const path = require("path");

// Debug logging
function debugLog(message, data = '') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message} ${data}\n`;
  console.error(logMessage.trim());
  try {
    fs.appendFileSync(path.join(__dirname, 'mcp-debug.log'), logMessage);
  } catch (e) {
    // Ignore logging errors
  }
}

// Load emoji data
let emojiData = {};
try {
  debugLog("Loading emoji data...");
  const dataPath = path.join(__dirname, "emojis.json");
  debugLog("Data path:", dataPath);
  
  if (!fs.existsSync(dataPath)) {
    throw new Error(`Emoji data file not found: ${dataPath}`);
  }
  
  emojiData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  debugLog("Emoji data loaded successfully", `${Object.keys(emojiData).length} emojis`);
} catch (error) {
  debugLog("Error loading emoji data:", error.message);
  console.error("Error loading emoji data:", error);
  process.exit(1);
}

// Helper function for fuzzy search
function fuzzySearch(query, options, maxResults = 10) {
  const results = [];
  const queryLower = query.toLowerCase();
  
  for (const option of options) {
    const optionLower = option.toLowerCase();
    let score = 0;
    
    // Exact match gets highest score
    if (optionLower === queryLower) {
      score = 1000;
    }
    // Starts with query gets high score
    else if (optionLower.startsWith(queryLower)) {
      score = 500 + (queryLower.length / optionLower.length) * 100;
    }
    // Contains query gets medium score
    else if (optionLower.includes(queryLower)) {
      score = 100 + (queryLower.length / optionLower.length) * 50;
    }
    // Check for partial character matches
    else {
      let matches = 0;
      let i = 0;
      for (const char of queryLower) {
        const index = optionLower.indexOf(char, i);
        if (index !== -1) {
          matches++;
          i = index + 1;
        }
      }
      if (matches > 0) {
        score = (matches / queryLower.length) * 20;
      }
    }
    
    if (score > 0) {
      results.push({ name: option, score });
    }
  }
  
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(r => r.name);
}

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
  debugLog("ListTools request received");
  return {
    tools: [
      {
        name: "get_emojis",
        description: "Get a list of all available iOS emoji names",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "search_emojis",
        description: "Search for emojis by name with fuzzy matching",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query to find matching emoji names",
            },
            limit: {
              type: "number",
              description: "Maximum number of results to return (default: 10)",
              default: 10,
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_url",
        description: "Get the URL for a specific emoji with optional size",
        inputSchema: {
          type: "object",
          properties: {
            emoji: {
              type: "string",
              description: "The emoji name (e.g., '100', 'a', '8ball')",
            },
            size: {
              type: "string",
              description: "Size version: '160' for 160x160px or '320' for 320x320px (default: '160')",
              enum: ["160", "320"],
              default: "160",
            },
          },
          required: ["emoji"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  debugLog("CallTool request received", JSON.stringify(request.params));
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "get_emojis": {
      const emojiNames = Object.keys(emojiData).sort();
      return {
        content: [
          {
            type: "text",
            text: `Available iOS emojis (${emojiNames.length} total):\n${emojiNames.join(", ")}`,
          },
        ],
      };
    }
    
    case "search_emojis": {
      const query = args?.query;
      if (!query) {
        throw new McpError(ErrorCode.InvalidParams, "Query parameter is required");
      }
      
      const limit = args?.limit || 10;
      const emojiNames = Object.keys(emojiData);
      const results = fuzzySearch(query, emojiNames, limit);
      
      if (results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No emojis found matching "${query}". Try a different search term.`,
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: `Found ${results.length} emoji(s) matching "${query}":\n${results.join(", ")}`,
          },
        ],
      };
    }
    
    case "get_url": {
      const emoji = args?.emoji;
      if (!emoji) {
        throw new McpError(ErrorCode.InvalidParams, "Emoji parameter is required");
      }
      
      const size = args?.size || "160";
      
      if (!emojiData[emoji]) {
        return {
          content: [
            {
              type: "text",
              text: `Emoji "${emoji}" not found. Use get_emojis or search_emojis to find available emojis.`,
            },
          ],
        };
      }
      
      if (!emojiData[emoji][size]) {
        const availableSizes = Object.keys(emojiData[emoji]);
        return {
          content: [
            {
              type: "text",
              text: `Size "${size}" not available for emoji "${emoji}". Available sizes: ${availableSizes.join(", ")}`,
            },
          ],
        };
      }
      
      const url = emojiData[emoji][size];
      return {
        content: [
          {
            type: "text",
            text: `Emoji: ${emoji}\nSize: ${size}x${size}px\nURL: ${url}`,
          },
        ],
      };
    }
    
    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  }
});

async function runServer() {
  try {
    debugLog("Starting iOS Emoji MCP Server...");
    debugLog("Node version:", process.version);
    debugLog("Working directory:", process.cwd());
    debugLog("Script path:", __filename);
    
    const transport = new StdioServerTransport();
    debugLog("StdioServerTransport created");
    
    await server.connect(transport);
    debugLog("Server connected successfully");
    console.error("iOS Emoji MCP Server running on stdio");
  } catch (error) {
    debugLog("Failed to start server:", error.message);
    debugLog("Error stack:", error.stack);
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  runServer().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
}