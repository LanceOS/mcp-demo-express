
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


    async getTools() {
        try {
            /**
             * This calls the tools list by sending a request to the MCP using the tools/list request.
             * The MCP server response with the available tools
             */
            const toolData = await this.client.listTools()
            const formatted = toolData.tools.map(tool => {
                return {
                    name: tool.name,
                    description: tool.description,
                    input_schema: tool.inputSchema
                }
            })
            return formatted
        }
        catch (error) {
            throw new Error(`Failed to get client tools: ${error}`)
        }
    }



    /**
     * Call a tool with a name and optional arguments
     * @param name The name of the tool to call
     * @param args Object containing the arguments for the tool
     * @returns Returns the data from the tool
     */
    async useTool(name: string, args?: any) {
        console.log("Tool arguments:", args);

        try {
            if (args && Object.keys(args).length > 0) {
                // Call the tool with arguments
                const result = await this.client.callTool({
                    name: name,
                    arguments: args
                });

                console.log("Tool result:", result);
                return result;
            }

            // Call the tool without arguments
            const result = await this.client.callTool({
                name: name,
            });

            if (result.results && Array.isArray(result.results)) {
                return {
                    ...result,
                    content: result.results // Add the content property expected by the client
                };
            }

            return result;
        }
        catch (error) {
            console.error("Failed to call tool:", error);
            throw error;
        }
    }


}

export default MCPClient;