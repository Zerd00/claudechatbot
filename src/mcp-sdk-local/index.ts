// src/mcp-sdk-local/index.ts
import { Express } from 'express';
import { Tool } from '../types';
import { VALID_FRAME_TYPES, FRAME_TYPE_DESCRIPTIONS } from '../constants/frame_types';
import { VALID_FURNISHED, FURNISHED_DESCRIPTIONS } from '../constants/furnished';
import { VALID_STATES } from '../constants/states';

export function registerMcpMiddleware(app: Express, modules: Tool[]) {
  for (const tool of modules) {
    app.post(`/mcp/${tool.config.name}`, async (req, res) => {
      try {
        const result = await tool.run(req.body);
        res.json(result);
      } catch (err: any) {
        res.status(500).json({ error: 'Tool failed', message: err.message });
      }
    });
  }

  console.log('✅ Loaded MCP tools:', modules.map(t => t.config.name).join(', '));
}

export function getToolDefinitions(modules: Tool[]) {
  return modules.map(tool => {
    const parametersWithDescriptions = JSON.parse(JSON.stringify(tool.config.inputSchema));

    if (parametersWithDescriptions?.properties?.frameType) {
      parametersWithDescriptions.properties.frameType.items = {
        type: 'string',
        enum: VALID_FRAME_TYPES,
        enumDescriptions: FRAME_TYPE_DESCRIPTIONS
      };
    }

    if (parametersWithDescriptions?.properties?.furnished) {
      parametersWithDescriptions.properties.furnished.items = {
        type: 'string',
        enum: VALID_FURNISHED,
        enumDescriptions: FURNISHED_DESCRIPTIONS
      };
    }

    if (parametersWithDescriptions?.properties?.states) {
      parametersWithDescriptions.properties.states.items = {
        type: 'string',
        enum: VALID_STATES,
        enumDescriptions: VALID_STATES.map(s => s.replace(/_/g, ' ').toLowerCase())
      };
    }

    return {
      function: {
        name: tool.config.name,
        description: tool.config.description,
        parameters: parametersWithDescriptions,
      },
    };
  });
}
