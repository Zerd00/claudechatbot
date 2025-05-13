// src/tools/scan-car-website/index.ts
import playwright from 'playwright';
import { ToolInputId, ToolResult, ToolConfig } from '../../types';


export async function run({ id }: ToolInputId): Promise<ToolResult> {

  const url = `https://www.car.gr/classifieds/cars/view/${id}/`;
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const rawText = await page.evaluate(() => document.body.innerText);
    await browser.close();

    return {
      name: `Car #${id}`,
      description: 'Scraped car listing info.',
      facts: [rawText]
    };
  } catch (error: any) {
    await browser.close();
    return {
      name: `Car #${id}`,
      description: 'Failed to scrape.',
      error: error.message
    };
  }
}

export const config: ToolConfig = {
  name: 'scanCarWebsite',
  description: 'Scan car listing from car.gr by ID.',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Car ID (e.g. 42664085)' }
    },
    required: ['id']
  }
};
