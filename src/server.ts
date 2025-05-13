import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { registerMcpMiddleware, getToolDefinitions } from './mcp-sdk-local/index';
import { Tool } from './types';
import { tools as externalTools } from './tools';
import * as cheerio from 'cheerio';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const tools: Tool[] = [...externalTools];
registerMcpMiddleware(app, tools);

app.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  console.log('\n📩 New prompt from user:\n', prompt);

  const toolDefs = getToolDefinitions(tools);
  const claudeTools = toolDefs.map(({ function: f }) => ({
    name: f.name,
    description: f.description,
    input_schema: f.parameters,
  }));

  const forceGetDetails = /detail(s)?|more info|expand|full info|show more/i.test(prompt);
  const tool_choice = forceGetDetails ? { type: 'tool', name: 'getPropertyDetails' } : { type: 'auto' };

  const initialResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: `You are a real estate assistant.
Always use the tool "getPropertyDetails" when the user mentions "details", "more info", "expand", or "show more".
Never use "filterProperties" to provide details.
Never invent, rephrase or guess property details.
Only structure what you receive inside the tool_result.`,
      messages: [{ role: 'user', content: prompt }],
      tools: claudeTools,
      tool_choice,
    }),
  });

  const data = await initialResponse.json();
  console.log('🤖 Claude initial response:\n', JSON.stringify(data, null, 2));

  const toolUse = data.content?.find((c: any) => c.type === 'tool_use');
  if (!toolUse) {
    console.warn('⚠️ No tool_use detected!');
    return res.json({ reply: data.content?.[0]?.text || '❌ No tool triggered by Claude.' });
  }

  console.log('🛠 Tool requested by Claude:', toolUse.name);
  console.log('🧾 Tool input:', toolUse.input);

  const tool = tools.find((t: Tool) => t.config.name === toolUse.name);
  if (!tool) {
    return res.status(400).json({ reply: `❌ Tool ${toolUse.name} not found.` });
  }

  const result = await tool.run(toolUse.input);
  console.log('📤 Tool result returned to Claude:', JSON.stringify(result, null, 2));

  const toolUseId = 'tool-use-filter-1';
  let html = '';

  if (typeof result === 'string') {
    html = result;
  } else if ('content' in result) {
    html = (result as any).content;
  } else if ('facts' in result && Array.isArray(result.facts)) {
    html = result.facts
      .map((item: any) => {
        const lines = Object.entries(item)
          .map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`)
          .join('');
        return `<ul>${lines}</ul>`;
      })
      .join('');
  }

  if (!html && typeof (result as any)?.content === 'string') {
    console.warn('⚠️ Using Cheerio fallback');
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

    html = blocks.join('');
  }

  const chunkedMessages: any[] = [
    { role: 'user', content: prompt },
    { role: 'assistant', content: [{ type: 'tool_use', id: toolUseId, name: toolUse.name, input: toolUse.input }] },
    {
      role: 'user',
      content: [
        {
          type: 'tool_result',
          tool_use_id: toolUseId,
          content: `<h2>Available Properties</h2>${html}`,
        },
      ],
    },
  ];

  const followUp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: `STRICT MODE: You must only output the provided HTML.
Do not change, invent, or reword any part.
Render the tool_result HTML cleanly and safely.`,
      messages: chunkedMessages,
    }),
  });

  const followData = await followUp.json();
  const reply = followData.content?.[0]?.text?.trim();

  return res.json({
    reply: reply && reply.length > 0 ? reply : '✅ Tool results sent successfully.',
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
