// src/tools/scan-website/index.ts
import playwright from 'playwright';
import { ToolInputId, ToolResult, ToolConfig } from '../../types';

export async function run({ id }: ToolInputId): Promise<ToolResult> {

  const url = `https://www.kopanitsanos.gr/en/property-detail/${id}`;
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const rawText = await page.evaluate(() => document.body.innerText);
    await browser.close();

    return {
      name: `Property #${id}`,
      description: 'Scraped property info.',
      facts: [rawText]
    };
  } catch (error: any) {
    await browser.close();
    return {
      name: `Property #${id}`,
      description: 'Failed to scrape.',
      error: error.message
    };
  }
}

export const config: ToolConfig = {
  name: 'scanWebsite',
  description: 'Scan real estate listing from kopanitsanos.gr by ID.',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Property ID (e.g. 3702)' }
    },
    required: ['id']
  }
};