# 📱 iOS Emoji MCP Server

A Model Context Protocol (MCP) server that provides access to iOS emoji images with URLs for both 160x160px and 320x320px versions.

## 🚀 Quick Start with npx

You can run this MCP server without installation using npx:

```json
{
  "mcpServers": {
    "ios-emoji-mcp": {
      "command": "npx",
      "args": ["-y", "ios-emoji-mcp@latest"]
    }
  }
}
```

Or on Windows:

```json
{
  "mcpServers": {
    "ios-emoji-mcp": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "ios-emoji-mcp@latest"]
    }
  }
}
```

## 📦 Installation Options

### Global Installation
```bash
npm install -g ios-emoji-mcp
```

### Local Development
```bash
git clone https://github.com/Medard-prog/ios-emoji-mcp.git
cd ios-emoji-mcp
npm install
npm start
```

## ⚙️ Configuration

Add to your Claude Desktop config (`claude_desktop_config.json`):

### Using npx (Recommended)
```json
{
  "mcpServers": {
    "ios-emoji-mcp": {
      "command": "npx",
      "args": ["-y", "ios-emoji-mcp@latest"]
    }
  }
}
```

### Using global installation
```json
{
  "mcpServers": {
    "ios-emoji-mcp": {
      "command": "ios-emoji-mcp"
    }
  }
}
```

### Using local development
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

## 🛠️ Available Tools

### 1. `get_emojis`
Lists all available iOS emoji names.

⚠️ **Note:** Full list contains 1,559 emojis (~5,550 tokens)

**Parameters:** None

**Example:**
```
Available iOS emojis (1559 total):
100, 1234, 8ball, a, ab, abc, abcd, accept...
```

### 2. `search_emojis`
Search for emojis using fuzzy matching.

**Parameters:**
- `query` (required): Search term to find matching emojis
- `limit` (optional): Maximum results to return (default: 10)

**Examples:**
- Search for "ball": Returns `8ball`
- Search for "a": Returns `a`, `ab`, `8ball` (fuzzy matched)

### 3. `get_url`
Get the direct URL for a specific emoji with size options.

**Parameters:**
- `emoji` (required): Emoji name (e.g., "100", "a", "8ball")
- `size` (optional): "160" or "320" for pixel dimensions (default: "160")

**Example Response:**
```
Emoji: 8ball
Size: 160x160px
URL: https://cgi78hjdnd.ufs.sh/f/DJLnTzoE7sxZfDL7m68uRskvbxZ7Pm6WuCnrOjaoStGEylcI
```

## 🎯 Use Cases

- **Web Development**: Get direct URLs for iOS emojis in your applications
- **Content Creation**: Access high-quality emoji images for designs
- **Documentation**: Include iOS-style emojis in documentation
- **Chat Applications**: Implement iOS emoji support

## 📊 Features

- ✅ **Fuzzy Search**: Find emojis even with partial or approximate names
- ✅ **Multiple Sizes**: 160x160px and 320x320px versions available
- ✅ **Direct URLs**: Get direct links to emoji images
- ✅ **Fast Access**: No API keys or authentication required
- ✅ **Comprehensive**: Includes all major iOS emoji variants

## 🔧 Technical Details

- Built with the Model Context Protocol (MCP) SDK
- Uses JSON data file for emoji mappings
- Implements fuzzy search algorithm for flexible emoji discovery
- Supports both CommonJS and ESM environments
- Zero external dependencies beyond MCP SDK

## 📝 Example Workflow

1. **Discover emojis**: Use `get_emojis` to see all available options
2. **Search**: Use `search_emojis` with a query like "ball" or "letter"
3. **Get URL**: Use `get_url` with the exact emoji name and preferred size
4. **Use**: Copy the URL and use it in your application or content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use in your projects!

## 🐛 Issues

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/Medard-prog/ios-emoji-mcp/issues).

---

*Made with ❤️ for the MCP community*