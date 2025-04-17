<script lang="ts">
	import { onMount } from 'svelte';
	import MCPClient from '$lib/mcp/Client';
	import ClaudeClient from '$lib/ai/Claude';

	let messages: Array<{ id: number; text: string; sender: 'user' | 'bot' }> = [];
	let inputText = '';
	let messageId = 0;

	function sendMessage() {
		if (inputText.trim() === '') return;

		// Add user message
		messages = [...messages, { id: messageId++, text: inputText, sender: 'user' }];
		const currentInput = inputText;
		inputText = '';
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	/**
	 * Starting the MCP client on mount however you would only need to start it when the user
	 * interacts with the ai assistant. Once the user is done interacting you would disconnect
	 * the user.
	 */
	onMount(async () => {
		const mcp = new MCPClient();
		mcp.runClient();

		// const response = await claude.initiate();
		// console.log(response);
		/**
		 * Greeting Message
		 */
		messages = [{ id: messageId++, text: response.text, sender: 'bot' }];
	});
</script>

<main class="mx-auto flex h-dvh max-w-7xl flex-col gap-6 px-4 py-8">
	<h1 class="text-4xl font-bold text-gray-800">AI Chat Assistance</h1>

	<div
		class="flex flex-1 flex-col gap-4 overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-sm"
	>
		<!-- Messages container -->
		<div class="flex-1 space-y-4 overflow-y-auto p-4">
			{#each messages as message}
				<div class="flex {message.sender === 'user' ? 'justify-end' : 'justify-start'}">
					<div
						class={`max-w-3/4 rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
					>
						{message.text}
					</div>
				</div>
			{/each}
		</div>

		<!-- Input area -->
		<div class="border-t border-gray-200 p-4">
			<div class="flex gap-2">
				<textarea
					bind:value={inputText}
					on:keydown={handleKeyPress}
					class="flex-1 resize-none rounded-lg border-2 border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					placeholder="Type your message here..."
					rows="2"
				/>
				<button
					on:click={sendMessage}
					class="self-end rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
					disabled={!inputText.trim()}
				>
					Send
				</button>
			</div>
		</div>
	</div>
</main>

<style>
	/* Custom scrollbar */
	.overflow-y-auto::-webkit-scrollbar {
		width: 6px;
	}
	.overflow-y-auto::-webkit-scrollbar-track {
		background: #f1f1f1;
	}
	.overflow-y-auto::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 3px;
	}
	.overflow-y-auto::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}
</style>
