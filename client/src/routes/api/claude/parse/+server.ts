import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_API } from '$env/static/private';



export async function POST({ request }) {

    const body = await request.json()

    const client = new Anthropic({
        apiKey: CLAUDE_API
    })

    if (!client || !body) return;

    try {
        // Transform previousData to the correct format with string content
        const formattedMessages = body.previousData.map(msg => ({
            role: msg.sender === 'bot' ? 'assistant' : 'user',
            content: String(msg.text) // Ensure content is a string
        }));

        // Add the new message
        formattedMessages.push({
            role: 'user',
            content: String(body.newData) // Ensure content is a string
        });

        const message = await client.messages.create({
            max_tokens: 1024,
            system: `
                You are going to parse incoming data and summarize it into an easy to understand
                and readable format for the user to read. 
            `,
            messages: formattedMessages,
            model: 'claude-3-haiku-20240307',
        });

        return new Response(JSON.stringify({ data: message.content[0] }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    catch (error) {
        if (!error) return;
        throw new Error(`Failed to create message: ${error.message}`);
    }
}