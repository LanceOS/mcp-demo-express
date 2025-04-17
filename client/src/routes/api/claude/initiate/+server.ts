import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_API } from '$env/static/private';



export async function POST({ request }) {

    const body = await request.json()
    const client = new Anthropic({
        apiKey: CLAUDE_API
    })

    if (!client) {
        return new Response(
            JSON.stringify({ error: 'Failed to initialize Claude client.' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    if (!body) {
        return new Response(
            JSON.stringify({ error: 'Missing body in the request.' }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    try {
        const response = await client.messages.create({
            max_tokens: 1024,
            system: `
            You are a help bot that is designed to help partners find and
            more easily understand their distribution data.
        
            Please present the data in a structured and human readable format that is
            easily understood and right to the point while still providing key details from
            the data you receive.

            Please greet with "Hello how can I assist you today" only.
          `,
            messages: [{
                role: 'user',
                content: "Hello"
            }],
            model: 'claude-3-haiku-20240307',
            /**
             * tool sent to claude should be stringified
             */
            tools: body
        });

        return new Response(JSON.stringify({ data: response.content[0] }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    catch (error) {
        console.error("Claude API error:", error);
        return new Response(JSON.stringify({
            error: `Failed to initiate Claude: ${error?.message || 'Unknown error'}`
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}