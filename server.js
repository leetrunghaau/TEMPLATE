import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "my-mcp",
    version: "1.0.0"
  },
  {
    tools: {
      hello: {
        description: "Say hello",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string" }
          },
          required: ["name"]
        },
        async run({ name }) {
          return { message: `Hello ${name}` };
        }
      }
    }
  }
);

const transport = new StdioTransport();
await server.connect(transport);
