import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_API } from '$env/static/private';



export async function POST({ request }) {

    const body = await request.json()

    const client = new Anthropic({
        apiKey: CLAUDE_API
    })

    if (!client || !body) return;

    try {
        const message = await client.messages.create({
            max_tokens: 1024,
            /**
             * Specific dates do not need to be given as long as the quarter and year are mentioned,
             * claude will autoformat the dates into parameters.
             */
            system: `
                If user makes a request use the appropriate tool.
                All dates given must be in the ISO 8601 format. If the user does provide a direct ISO format, convert it to one.
                For instance Q1  to Q2, grab the first day of Q1 and Q2 and make those ISO formats.
            `,
            messages: [{ role: 'user', content: body.message }],
            model: 'claude-3-haiku-20240307',
            /**
             * tool sent to claude should be stringified
             */
            tools: body?.tools
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