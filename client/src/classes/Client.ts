
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

/**
 * Connecting with a URL object
 */
const transport = new SSEClientTransport(new URL("http://localhost:7000/sse"));

class MCPClient {
    instance: MCPClient | null = null;

    constructor() {
        if (this.instance) return this.instance;
        this.instance = this;
    }

    /**
     * Creating new Client
     */
    client = new Client({
        name: "example-client",
        version: "1.0.0"
    })

    /**
     * Running client and listing its tools
     */
    async runClient() {
        try {
            await this.client.connect(transport);
            console.log("Connected to MCP server.");

            const tools = await this.client.listTools()
            console.log("Tools from server:", tools)

        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    /**
     * Disconnecting client from server
     */
    async closeClient() {
        try {
            await this.client.close();
            console.log("Disconnected from MCP server.");
        }
        catch (error) {
            console.error("Error disconnecting client:", error)
        }
    }
}

export default MCPClient;