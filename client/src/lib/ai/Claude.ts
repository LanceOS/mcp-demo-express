


class ClaudeClient {
    instance: ClaudeClient | null = null;

    constructor() {
        if (this.instance) return this.instance;
        this.instance = this;
    }


    async initiate() {
        try {
            const response = await fetch("/api/claude/initiate", {
                method: "POST",
            })
            const data = await response.json()
            return data.data;
        }
        catch (error) {
            if (!error) return error
            throw new Error(`Failed to initiate Claude: ${error.message}`);
        }
    }

    async createMessage(input: string) {
        try {
            const response = await fetch("/api/claude/create", {
                method: "POST",
                body: input
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