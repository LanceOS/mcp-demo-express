


class ClaudeClient {
    instance: ClaudeClient | null = null;

    constructor() {
        if (this.instance) return this.instance;
        this.instance = this;
    }


    async initiate(tools: object) {

        try {
            const response = await fetch("/api/claude/initiate", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tools)
            })
            const data = await response.json()
            return data.data;
        }
        catch (error) {
            if (!error) return error
            throw new Error(`Failed to initiate Claude: ${error.message}`);
        }
    }

    async createMessage(messages: object[], tools?: object) {
        try {
            const response = await fetch("/api/claude/create", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: messages, tools: tools })
            })
            const data = await response.json()
            return data.data;
        }
        catch (error) {
            if (!error) return;
            throw new Error(`Failed to create new message: ${error.message}`);
        }
    }

    async parseResponse(input: object[], toolData: string) {
        try {
            const response = await fetch("/api/claude/parse", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: input, newData: toolData })
            })
            const data = await response.json()
            return data.data;
        }
        catch (error) {
            if (!error) return;
            throw new Error(`Failed to create new message: ${error.message}`);
        }
    }
}


export default ClaudeClient;