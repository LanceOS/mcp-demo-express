import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_API } from '$env/static/private';



export async function POST({ request }) {

    const body = await request.json()

    const client = new Anthropic({
        apiKey: CLAUDE_API
    })

    if (!client || !body) return;
    console.log(body.newData)

    try {
        const formattedMessages = body.messages.map(msg => ({
            role: msg.sender === 'bot' ? 'assistant' : 'user',
            content: String(msg.text)
        }));

        const message = await client.messages.create({
            max_tokens: 1024,
            system: `
                You are going to parse incoming data and summarize it into an easy to understand
                and readable format for the user to read.

                Here is the imported data:
                ${body.newData}
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