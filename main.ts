import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import tools from "./tools";

const server = new McpServer ({
  name: "first",
  version: "1.0.0",
});

tools.forEach(({ name, description, schema, cb }) => server.tool(name, description, schema, cb))

const transport = new StdioServerTransport()
server.connect(transport)
