import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const server = new McpServer({
  name: 'person-crud-server',
  version: '1.0.0',
});

// LIST all persons
server.tool(
  'list_persons',
  'Get all persons from the database',
  {},
  async () => {
    const persons = await prisma.person.findMany({ orderBy: { createdAt: 'desc' } });
    return {
      content: [{ type: 'text', text: JSON.stringify(persons, null, 2) }],
    };
  }
);

// GET single person by ID
server.tool(
  'get_person',
  'Get a single person by their ID',
  { id: z.number().describe('The person ID') },
  async ({ id }) => {
    const person = await prisma.person.findUnique({ where: { id } });
    if (!person) {
      return { content: [{ type: 'text', text: `Person with ID ${id} not found.` }] };
    }
    return { content: [{ type: 'text', text: JSON.stringify(person, null, 2) }] };
  }
);

// CREATE a person
server.tool(
  'create_person',
  'Create a new person record in the database',
  {
    firstName: z.string().describe('First name of the person'),
    lastName: z.string().describe('Last name of the person'),
    email: z.string().email().describe('Email address (must be unique)'),
    phone: z.string().optional().describe('Phone number (optional)'),
    age: z.number().optional().describe('Age of the person (optional)'),
    address: z.string().optional().describe('Address of the person (optional)'),
  },
  async ({ firstName, lastName, email, phone, age, address }) => {
    const person = await prisma.person.create({
      data: { firstName, lastName, email, phone: phone || null, age: age || null, address: address || null },
    });
    return {
      content: [{ type: 'text', text: `Person created successfully!\n${JSON.stringify(person, null, 2)}` }],
    };
  }
);

// UPDATE a person
server.tool(
  'update_person',
  'Update an existing person by their ID',
  {
    id: z.number().describe('The person ID to update'),
    firstName: z.string().optional().describe('New first name'),
    lastName: z.string().optional().describe('New last name'),
    email: z.string().email().optional().describe('New email address'),
    phone: z.string().optional().describe('New phone number'),
    age: z.number().optional().describe('New age'),
    address: z.string().optional().describe('New address'),
  },
  async ({ id, ...updates }) => {
    const existing = await prisma.person.findUnique({ where: { id } });
    if (!existing) {
      return { content: [{ type: 'text', text: `Person with ID ${id} not found.` }] };
    }
    const person = await prisma.person.update({
      where: { id },
      data: {
        firstName: updates.firstName ?? existing.firstName,
        lastName: updates.lastName ?? existing.lastName,
        email: updates.email ?? existing.email,
        phone: updates.phone !== undefined ? updates.phone : existing.phone,
        age: updates.age !== undefined ? updates.age : existing.age,
        address: updates.address !== undefined ? updates.address : existing.address,
      },
    });
    return {
      content: [{ type: 'text', text: `Person updated successfully!\n${JSON.stringify(person, null, 2)}` }],
    };
  }
);

// DELETE a person
server.tool(
  'delete_person',
  'Delete a person record by their ID',
  { id: z.number().describe('The person ID to delete') },
  async ({ id }) => {
    const existing = await prisma.person.findUnique({ where: { id } });
    if (!existing) {
      return { content: [{ type: 'text', text: `Person with ID ${id} not found.` }] };
    }
    await prisma.person.delete({ where: { id } });
    return {
      content: [{ type: 'text', text: `Person "${existing.firstName} ${existing.lastName}" (ID: ${id}) deleted successfully.` }],
    };
  }
);

// SEARCH persons
server.tool(
  'search_persons',
  'Search for persons by name or email',
  { query: z.string().describe('Search query — matches first name, last name, or email') },
  async ({ query }) => {
    const persons = await prisma.person.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    if (persons.length === 0) {
      return { content: [{ type: 'text', text: `No persons found matching "${query}".` }] };
    }
    return {
      content: [{ type: 'text', text: `Found ${persons.length} person(s):\n${JSON.stringify(persons, null, 2)}` }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Person CRUD MCP Server running on stdio');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
