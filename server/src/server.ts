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
server.tool("get_distribution_data", "Retrieves and provides information about partner distribution data based on the provided start and end dates.",
    {
        start_date: z.string(),
        end_date: z.string()
    },
    async (args) => {
        console.log(args)
        try {
            const apiUrlWithParams = `${process.env.API_BASE}?start_date=${args.start_date}&end_date=${args.end_date}`;
            const response = await fetch(apiUrlWithParams, {
                method: "GET",
                headers: {
                    "X-API-Key": process.env.PARTNER_ID
                }
            })

            const data = await response.json()

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data.results),
                    },
                ],
            }
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

