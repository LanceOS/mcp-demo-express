
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

/**
 * Connecting with a URL object
 */
const transport = new SSEClientTransport(new URL("http://localhost:7000/sse"));

interface ITool {
    name: string,
    argument: IArg[]
}

interface IArg {
    arg: string | number;
}

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
        name: "Demo",
        version: "1.0.0"
    })

    /**
     * Running client and listing its tools
     */
    async runClient() {
        try {
            await this.client.connect(transport);
            console.log("Connected to MCP server.");

            /**
             * This calls the tools list by sending a request to the MCP using the tools/list request.
             * The MCP server response with the available tools
             */
            const tools = await this.client.listTools()
            console.log("Tools from server:", tools)

            return tools;
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

    /**
     * 
     * @param args Grab the tool name as well as the tool parameters
     * @returns Returns the data from the tool
     */
    async useTool(args: ITool) {
        try {
            const result = await this.client.callTool({
                name: args.name
            });

            if (!result) return;
            return result;
        }
        catch (error) {
            if (!error) return console.error(error);
            throw new Error("Failed to call tool:", error)
        }
    }
}

export default MCPClient;