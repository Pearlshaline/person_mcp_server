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

- "List all persons in the database"
![Example #1](/screenshots/Q1.png)
- "Create a person named John Doe with email john@example.com, age 25, phone + 63 946 882 2314"
![Example #2](/screenshots/Q2.png)
- "Get person with ID 12"
![Example #3](/screenshots/Q3.png)
- "Update person 12's age to 21"
![Example #4](/screenshots/Q4.png)
- "Search for persons named Ana Reyes"
![Example #5](/screenshots/Q5.png)
- "Delete person with ID 7"
![Example #6](/screenshots/Q6.png)

## Tech Stack

- Node.js + TypeScript
- MCP SDK (`@modelcontextprotocol/sdk`)
- Prisma ORM
- PostgreSQL (Neon)
