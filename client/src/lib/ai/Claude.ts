import { CLAUDE_API } from '$env/static/private';
import Anthropic from '@anthropic-ai/sdk';


class ClaudeClient {
    instance: ClaudeClient | null = null;

    constructor() {
        if (this.instance) return this.instance;
        this.instance = this;
    }

    client = new Anthropic({
        apiKey: CLAUDE_API
    })

    async initiate(input: string) {
        try {
            const message = await this.client.messages.create({
                max_tokens: 1024,
                messages: [{ role: 'user', content: input }],
                model: 'claude-3-5-sonnet-latest',
            });

            return message
        }
        catch (error) {
            if (!error) return error
            throw new Error("Failed to initiate claude:", error)
        }
    }

    async createMessage(input: string) {
        try {
            const message = await this.client.messages.create({
                max_tokens: 1024,
                messages: [{ role: 'user', content: input }],
                model: 'claude-3-5-sonnet-latest',
            });

            return message
        }
        catch (error) {
            if (!error) return;
            throw new Error("Failed to create message:", error)
        }
    }
}


export default ClaudeClient;