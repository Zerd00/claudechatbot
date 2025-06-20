// server/routes.ts
import { Application, Request, Response } from 'express';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { getAllTools, getToolDefinitionsList } from './tools';
import { callClaude } from './claude';
import { splitHtmlIntoChunks } from './claude';
import { generatePropertyHtml } from './tools/generate-property-html';
import { generatePropertyDetailHtml } from './tools/generate-property-detail-html';

export function setupRoutes(app: Application) {
  // === Chat route: Claude chooses the tool, backend responds directly in HTML ===
  app.post('/chat', async (req: Request, res: Response) => {
    const { prompt } = req.body;
    console.log('\n📩 New prompt from user:\n', prompt);

    const tools = getAllTools();
    const toolDefs = getToolDefinitionsList();

    // === Build Claude's tools array ===
    const claudeTools = toolDefs.map(({ function: f }) => ({
      name: f.name,
      description: f.description,
      input_schema: f.parameters,
    }));

    // === Auto/forced tool selection based on prompt ===
    const forceGetDetails = /detail(s)?|more info|expand|full info|show more/i.test(prompt);
    const tool_choice = forceGetDetails
      ? { type: 'tool', name: 'getPropertyDetails' }
      : { type: 'auto' };

    // === 1. First Claude call (tool selection) ===
    const data = await callClaude(prompt, claudeTools, tool_choice);
    const toolUse = data.content?.find((c: any) => c.type === 'tool_use');

    // === PATCH: Fallback to Claude only if no tool was used ===
    if (!toolUse) {
      console.warn('⚠️ No tool_use detected! (fallback Claude response)');
      const fallback = await callClaude(
        prompt,
        undefined,
        undefined,
        "You are a helpful assistant. Reply naturally to the user's request. You are not restricted to real estate: reply in a friendly, conversational manner if possible."
      );
      return res.json({
        html: fallback.content?.[0]?.text || '🤖 Claude could not answer your question.',
      });
    }

    console.log('🛠 Tool requested by Claude:', toolUse.name);
    console.log('🧾 Tool input:', JSON.stringify(toolUse.input, null, 2));

    const tool = tools.find((t: any) => t.config.name === toolUse.name);
    if (!tool) {
      console.error('❌ Tool not found:', toolUse.name);
      return res.status(400).json({ html: `❌ Tool ${toolUse.name} not found.` });
    }

    // === 2. MCP tool execution ===
    if (toolUse.input && prompt) {
      toolUse.input.prompt = prompt;
      console.log("[PATCH] Injected prompt into tool input:", toolUse.input);
    }
    const result = await tool.run(toolUse.input);
    console.log('📤 Tool result returned:\n', JSON.stringify(result, null, 2));

    // === 3. Map result to HTML or fallback (limite à 20 même pour le HTML tout prêt) ===
    let html = '';
    if ('facts' in result && Array.isArray(result.facts)) {
      html = generatePropertyHtml(result.facts.slice(0, 20));
    } else if (typeof result === 'string') {
      html = limitPropertyBlocks(result, 20);
    } else if ('content' in result && typeof (result as any).content === 'string') {
      html = limitPropertyBlocks((result as any).content, 20);
    }

    // === Fallback: Cheerio parse if result.content is raw HTML ===
    if (!html && typeof (result as any)?.content === 'string') {
      const rawHtml = (result as any).content;
      const $ = cheerio.load(rawHtml);
      const blocks: string[] = [];
      $('ul').each((_, ul) => {
        const lines = $(ul)
          .find('li')
          .map((_, li) => `<li>${$(li).text()}</li>`)
          .get()
          .join('');
        blocks.push(`<ul>${lines}</ul>`);
      });
      html = blocks.slice(0, 20).join('');
    }

    // === PATCH: Limit to 20 properties in __forceOutput (raw HTML listing) ===
    if ((result as any).__forceOutput) {
      html = limitPropertyBlocks((result as any).__forceOutput, 20);
    }

    return res.json({
      html: html || '✅ No property found.',
    });
  });

  // === Helper: cut any HTML block (with "Property Photo" blocks) to 20 results max ===
  function limitPropertyBlocks(html: string, max: number): string {
    if (!html) return '';
    // Essaie de splitter sur "Property Photo" pour découper chaque bloc propriété
    const blocks = html.split(/(?=Property Photo)/g);
    if (blocks.length > max) {
      return blocks.slice(0, max).join('');
    }
    return html;
  }

  // === Route for direct property list (for tests) ===
  app.get('/api/properties', (req: Request, res: Response) => {
    const filePath = path.join(__dirname, '../../memory/last-result.json');
    const results = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    // ✅ Limit to 20 properties here too
    const html = generatePropertyHtml(results.slice(0, 20));
    res.json({ html });
  });

  // === Route for property detail (for tests) ===
  app.get('/api/property/:id', (req: Request, res: Response) => {
    const filePath = path.join(__dirname, '../../memory/last-result.json');
    const results = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const property = results.find((p: any) => String(p.code) === String(req.params.id));
    // ✅ Custom detail display
    const html = property ? generatePropertyDetailHtml(property) : `<p>No property found with code ${req.params.id}</p>`;
    res.json({ html });
  });
}
