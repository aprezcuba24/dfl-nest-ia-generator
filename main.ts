import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer ({
  name: "first",
  version: "1.0.0",
});

server.tool(
  'fetch-weather',
  'Fetches the weather for a given city',
  {
    city: z.string().describe('The city to fetch the weather for')
  },
  async ({ city }) => {
    return {
      content: [
        {
          type: 'text',
          text: `The weather in ${city} is sunny.`
        }
      ]
    }
  }
)

const transport = new StdioServerTransport()
server.connect(transport)
