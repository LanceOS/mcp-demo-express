import express, { Request, Response } from "express"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk"
import cors from 'cors';
import "dotenv/config"

/**
 * Defines mcp server
 */
const server = new McpServer({
    name: "My Server",
    version: "1.0.0",
    capabilities: {
        tools: {
            /**
             * Server will emit notifications if the list of tools change
             */
            listChanged: true
        }
    }
});

const app = express();
app.use(cors())


/**
 * to support multiple simultaneous connections we have a lookup object from
 * sessionId to transport
 */
const transports: { [sessionId: string]: SSEServerTransport } = {};


app.get("/sse", async (_: Request, res: Response) => {
    const transport = new SSEServerTransport('/messages', res);
    transports[transport.sessionId] = transport;
    res.on("close", () => {
        delete transports[transport.sessionId];
    });
    await server.connect(transport);
});

app.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId];
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send('No transport found for sessionId');
    }
});


app.listen(7000, () => {
    console.log("Listening on port 7000")
});

/**
 * Server tool
 * First define its name and then an object that includes its params
 * Then the async (args) is the function that executes the tool
 */
server.tool("get_distribution_data",
    { description: "Retrieves and provides information about partner distribution data based on the user's query.", userInput: z.string() },
    async (args) => {
        try {
            const response = await fetch(process.env.API_BASE, {
                method: "GET",
                headers: {
                    "X-API-Token": process.env.PARTNER_ID
                }
            })

            const data = await response.json()
            console.log(data)
            return data
        }
        catch (err) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Error fetching data"
                    }
                ]
            }
        }
    }
);

