import express, { Request, Response } from "express"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk"
import "dotenv/config"


const client = new Anthropic({
    apiKey: process.env.CLAUDE_API
})

/**
 * Defines mcp server
 */
const server = new McpServer({
    name: "My Server",
    version: "1.0.0",
});

const app = express();


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

app.listen(3001);

/**
 * Server tool
 * First define its name and then an object that includes its params
 * Then the async (args) is the function that executes the tool
 */
server.tool("Get-distribution-data",
    { userInput: z.string() },
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
            const message = await client.messages
                .create({
                    model: 'claude-3-5-sonnet-latest',
                    max_tokens: 1024,
                    messages: [
                        {
                            role: 'user',
                            content: `
                                You are an assistant tasked with fetching partner distribution data. Your task
                                is to use the information from the dashboard to help the user with their questions about
                                distribution data.

                                Here is the current data:
                                ${JSON.stringify(data)}


                                User query:
                                ${args.userInput}

                                Provide detailed and well structured responses that addresses the user's queries.
                            `
                        }
                    ],
                })
            return message;
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

