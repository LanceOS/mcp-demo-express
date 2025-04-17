import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_API } from '$env/static/private';



export async function POST() {

    const client = new Anthropic({
        apiKey: CLAUDE_API
    })


    if (!client) return;


    try {
        const message = await client.messages.create({
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
        });

        console.log(message.content[0])
        return new Response(JSON.stringify({ data: message.content[0] }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    catch (error) {
        if (!error) return error
        throw new Error(`Failed to initiate Claude: ${error.message}`);
    }
}