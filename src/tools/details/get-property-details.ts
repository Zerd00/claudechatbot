import fs from 'fs';
import path from 'path';
import { ToolConfig, ToolResult } from '../../types';
// @ts-ignore
import { generatePropertyHtml } from '../../utils/generate-property-html';



export async function run(input: { price?: number } = {}): Promise<ToolResult> {
  const memoryPath = path.resolve(__dirname, '../../../memory/last-result.json');
  console.log('📄 Reading memory from:', memoryPath);

  if (!fs.existsSync(memoryPath)) {
    console.warn('❌ Memory file not found!');
    return {
      name: 'Property Details',
      description: 'No memory found to extract property details.',
      facts: [],
    };
  }

  const raw = fs.readFileSync(memoryPath, 'utf-8');
  console.log('📚 Raw file content (first 500 chars):\n', raw.slice(0, 500));

  let json: any;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    console.error('❌ Failed to parse JSON:', e);
    return {
      name: 'Property Details',
      description: 'Memory file is corrupted or unreadable.',
      facts: [],
    };
  }

  let items = Array.isArray(json) ? json : json?.data?.items ?? json?.items ?? [];
  console.log('📦 Total properties loaded:', items.length);

  if (items.length === 0) {
    return {
      name: 'Property Details',
      description: 'No items available to extract details from.',
      facts: [],
    };
  }

  // 🧹 Remove heavy fields like "images"
  items = items.map((item: any) => {
    const { images, ...rest } = item;
    return rest;
  });

  // 🧪 Log first 100 items
  console.log('🔍 Sample properties (first 100):');
  items.slice(0, 100).forEach((item: any, index: number) => {
    console.log(`[${index}] ID: ${item.id}, Price: ${item.price}, Bedrooms: ${item.bedrooms}, Area: ${item.area}`);
  });

  // 🎯 If user filtered by price
  if (input.price && typeof input.price === 'number') {
    const filtered = items.filter((item: any) => Number(item.price) === input.price);
    console.log(`🔎 Filtering by price = ${input.price}: ${filtered.length} matches found`);

    if (filtered.length === 1) {
      const html = generatePropertyHtml(filtered[0]);
      return {
        name: 'Property Details',
        description: `Details for the property at ${input.price} euros.`,
        facts: [],
        content: html,
      };
    }

    return {
      name: 'Property Details',
      description: `STRICT MODE.
Multiple properties were found at price = ${input.price}.
You must now SELECT the most relevant one.
Each object below is a separate candidate.
Only return ONE result. DO NOT invent fields.`,
      facts: filtered.map((item: any) => ({ ...item })),
    };
  }

  // 📦 Default chunking
  const chunkSize = 50;
  const facts = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    console.log(`📤 Chunk ${facts.length + 1}: ${chunk.length} properties`);
    facts.push({ properties: chunk });
  }

  console.log(`✅ Total chunks created: ${facts.length}`);

  return {
    name: 'Property Details',
    description: `
STRICT MODE.
You are given a list of property objects in JSON.
Each fact is real — NEVER invent any field (price, bedrooms, location, etc).
If a field does not exist, OMIT IT.
Never hallucinate street names, addresses or cities.
Choose ONLY ONE property from the list that matches the user's question (ex: price = 420).
If you are not sure, say you cannot find a match.`,
    facts,
  };
}

export const config: ToolConfig = {
  name: 'getPropertyDetails',
  description: 'Returns a list of recent properties so the assistant can pick ONLY the most relevant one.',
  inputSchema: {
    type: 'object',
    properties: {
      price: { type: 'number', description: 'Exact price of the property to retrieve.' },
    },
    required: [],
  },
};

export default {
  config,
  run,
};
