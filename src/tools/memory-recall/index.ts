import fs from 'fs';
import path from 'path';
import { ToolConfig, ToolResult } from '../../types';

type PropertyItem = {
  id: number;
  title: string;
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: { city?: string };
};

export async function run(input: { query?: string }): Promise<ToolResult> {
  const memoryPath = path.resolve(__dirname, '../../../memory/last-result.json');

  if (!fs.existsSync(memoryPath)) {
    return {
      name: 'Memory Recall',
      description: 'No memory file found.',
      facts: [],
    };
  }

  const json = JSON.parse(fs.readFileSync(memoryPath, 'utf-8'));
  const items: PropertyItem[] = json?.data?.items ?? [];

  const query = input.query?.toLowerCase() ?? '';

  const matches = items.filter(item => {
    const priceMatch = query && item.price?.toString().includes(query);
    const titleMatch = item.title?.toLowerCase().includes(query);
    const cityMatch = item.location?.city?.toLowerCase().includes(query);
    return priceMatch || titleMatch || cityMatch;
  });

  const facts = matches.map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    area: item.area,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    city: item.location?.city,
    url: `https://www.kopanitsanos.gr/en/property-detail/${item.id}`,
  }));

  return {
    name: 'Memory Recall',
    description: 'Fetches the last properties seen by the user from memory.',
    facts,
  };
}

export const config: ToolConfig = {
  name: 'memoryRecall',
  description: 'Recalls the last set of properties returned to the user for follow-up questions.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Text to search for in last seen properties (e.g. "450", "detached house", "kalamata")',
      },
    },
    required: [],
  },
};
