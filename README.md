# Gemini Thinking MCP Server

A Model Context Protocol (MCP) server implementation for the Google Gemini language model. This server allows Claude Desktop users to access the powerful reasoning capabilities of Gemini-2.0-flash-thinking-exp-01-21 model.

## What is Gemini Flash?

Gemini-2.0-flash-thinking-exp-01-21 is a specialized version of Google's Gemini model that's optimized for fast responses while maintaining high quality. It excels at:

- Mathematical reasoning
- Logical deduction
- Step-by-step analysis
- Structured thinking

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm
- Claude Desktop
- Google Gemini API key

### Setup

1. Clone this repository:
```bash
git clone https://github.com/falahgs/gemini-thinking-mcp.git
cd gemini-thinking-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Google API key:
```
GEMINI_API_KEY=your-api-key-here
```

4. Build the project:
```bash
npm run build
```

## Configuring Claude Desktop

To use this MCP server with Claude Desktop, update your Claude Desktop configuration:

1. Locate your Claude Desktop config file:
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the following to the `mcpServers` section:
```json
"gemini-thinking": {
    "command": "node",
    "args": ["/path/to/gemini-thinking-mcp/build/index.js"],
    "env": {
        "GEMINI_API_KEY": "your-api-key"
    }
}
```

3. Restart Claude Desktop to apply the changes.

## Usage

Once configured, you can access the Gemini model in your Claude Desktop conversations:

```
@gemini-thinking Can you help me solve this math problem step by step?
```

### Parameters

You can adjust the model parameters:

- `prompt`: Your input text for Gemini (required)
- `max_tokens`: Maximum tokens to generate (default: 8192)
- `temperature`: Controls randomness (default: 0.2)

## Examples

Here are some examples of the Gemini Thinking MCP server setup and usage:

### Example 1: Installing MCP Server
![MCP Server Installation](images/Screenshot%202025-04-09%20094525.png)
This example shows the process of installing and configuring the Gemini Thinking MCP server in Claude Desktop environment.

### Example 2: Testing Mathematical Problem Solving
![Testing Mathematical Solver](images/Screenshot%202025-04-09%20094420.png)
A demonstration of the MCP server solving a mathematical equation step by step, showing its problem-solving capabilities.

## Deployment to GitHub

### Step by Step Guide

1. Create a new GitHub repository:
   - Go to [GitHub](https://github.com)
   - Click the "+" icon in the top right
   - Select "New repository"
   - Name it "gemini-thinking-mcp"
   - Choose visibility (public or private)
   - Click "Create repository"

2. Push your local code to GitHub:
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit"

# Add the remote repository
git remote add origin https://github.com/yourusername/gemini-thinking-mcp.git

# Push to GitHub
git push -u origin main
```

3. Verify your repository:
   - Go to your GitHub repository
   - Ensure all files are present
   - Check that your secret API key is not committed (only in .env)

## Development

```bash
npm run dev     # Watch mode
npm run build   # Build for production
npm start       # Run the server
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
