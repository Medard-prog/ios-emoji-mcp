# iOS Emoji MCP Server

A Model Context Protocol (MCP) server for iOS emoji functionality.

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

## Configuration

Add to your Claude Desktop config:

```json
{
  "mcpServers": {
    "ios-emoji-mcp": {
      "command": "node",
      "args": ["path/to/ios-emoji-mcp/index.js"]
    }
  }
}
```

## Tools

- `hello_world`: Simple greeting tool (placeholder for future emoji functionality)