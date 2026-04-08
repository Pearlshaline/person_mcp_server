# Person CRUD MCP Server

An MCP (Model Context Protocol) server that exposes Person CRUD operations as tools for Claude Desktop.

## Setup

### 1. Clone and install
```bash
git clone https://github.com/Pearlshaline/person_mcp_server.git
cd person_mcp_server
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your Neon database connection strings
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Build
```bash
npm run build
```

### 5. Configure Claude Desktop

Edit your Claude Desktop config file:
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "person-crud": {
      "command": "node",
      "args": ["C:/path/to/person-mcp-server/dist/index.js"],
      "env": {
        "DATABASE_URL": "your-pooled-neon-connection-string",
        "DIRECT_URL": "your-direct-neon-connection-string"
      }
    }
  }
}
```

### 6. Restart Claude Desktop

Fully quit and reopen Claude Desktop. You should see the 🔨 tools icon.

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `list_persons` | Get all persons from the database |
| `get_person` | Get a single person by ID |
| `create_person` | Create a new person record |
| `update_person` | Update an existing person |
| `delete_person` | Delete a person by ID |
| `search_persons` | Search persons by name or email |

## Example Prompts in Claude Desktop


## Tech Stack

- Node.js + TypeScript
- MCP SDK (`@modelcontextprotocol/sdk`)
- Prisma ORM
- PostgreSQL (Neon)
