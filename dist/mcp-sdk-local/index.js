"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMcpMiddleware = registerMcpMiddleware;
exports.getToolDefinitions = getToolDefinitions;
function registerMcpMiddleware(app, modules) {
    for (const tool of modules) {
        app.post(`/mcp/${tool.config.name}`, async (req, res) => {
            try {
                const result = await tool.run(req.body);
                res.json(result);
            }
            catch (err) {
                res.status(500).json({ error: 'Tool failed', message: err.message });
            }
        });
    }
    console.log('✅ Loaded MCP tools:', modules.map(t => t.config.name).join(', '));
}
function getToolDefinitions(modules) {
    return modules.map(tool => ({
        function: {
            name: tool.config.name,
            description: tool.config.description,
            parameters: tool.config.inputSchema
        }
    }));
}
