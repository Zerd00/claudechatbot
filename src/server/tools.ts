// server/tools.ts
import { Application } from 'express';
import { registerMcpMiddleware, getToolDefinitions } from '../mcp-sdk-local/index';
import { Tool } from '../types';
import { tools as externalTools } from '../tools';

let loadedTools: Tool[] = [];

export function registerAllTools(app: Application) {
  loadedTools = [...externalTools];
  registerMcpMiddleware(app as any, loadedTools);

  console.log('✅ MCP tools registered:', loadedTools.map(t => t.config.name).join(', '));
}

export function getAllTools(): Tool[] {
  return loadedTools;
}

export function getToolDefinitionsList() {
  return getToolDefinitions(loadedTools);
}
