import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_API } from '$env/static/private';



export async function POST({ request }) {

    const body = request.json()

    const client = new Anthropic({
        apiKey: CLAUDE_API
    })

    if (!client || !body) return;

    try {
        const message = await client.messages.create({
            max_tokens: 1024,
            messages: [{ role: 'user', content: body.input }],
            model: 'claude-3-haiku-20240307',
        });

        return message
    }
    catch (error) {
        if (!error) return;
        throw new Error(`Failed to create message: ${error.message}`);
    }
}