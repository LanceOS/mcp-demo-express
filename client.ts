import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";


const transport = new SSEClientTransport({
    url: "https://your-mcp-server.com/mcp"
});

const client = new Client(
    {
        name: "example-client",
        version: "1.0.0"
    }
);

await client.connect(transport);


const prompts = await client.listPrompts();


const prompt = await client.getPrompt({
    name: "example-prompt",
    arguments: {
        arg1: "value"
    }
});


const resources = await client.listResources();



const result = await client.callTool({
    name: "Get-distribution-data",
    arguments: {
        arg1: "value"
    }
});
