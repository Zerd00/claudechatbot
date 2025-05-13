"use strict";
// src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./mcp-sdk-local/index");
const tools_1 = require("./tools");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Serve static files and parse JSON requests
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
// Register tools using MCP middleware
(0, index_1.registerMcpMiddleware)(app, tools_1.tools);
// Claude chat endpoint
app.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    // Get tool definitions for Claude
    const toolDefs = (0, index_1.getToolDefinitions)(tools_1.tools);
    const claudeTools = toolDefs.map(({ function: f }) => ({
        name: f.name,
        description: f.description,
        input_schema: f.parameters,
    }));
    // First call to Claude with tool definitions
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            system: "You are an assistant for real estate and car listings. Choose the correct tool based on the user's request.",
            messages: [{ role: 'user', content: prompt }],
            tools: claudeTools,
            tool_choice: { type: 'auto' },
        }),
    });
    const data = await response.json();
    const toolUse = data.content?.find((c) => c.type === 'tool_use');
    // If a tool was selected by Claude
    if (toolUse) {
        const tool = tools_1.tools.find((t) => t.config.name === toolUse.name);
        const result = await tool.run(toolUse.input);
        // Follow-up request to Claude with tool result
        const followUp = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                messages: [
                    { role: 'user', content: prompt },
                    { role: 'assistant', content: [toolUse] },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'tool_result',
                                tool_use_id: toolUse.id,
                                content: JSON.stringify(result),
                            },
                        ],
                    },
                ],
            }),
        });
        const followData = await followUp.json();
        return res.json({ reply: followData.content?.[0]?.text || '❌ No response' });
    }
    return res.json({ reply: data.content?.[0]?.text || '❌ No response' });
});
// Start the Express server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
