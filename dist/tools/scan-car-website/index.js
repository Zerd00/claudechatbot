"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.run = run;
// src/tools/scan-car-website/index.ts
const playwright_1 = __importDefault(require("playwright"));
async function run({ id }) {
    const url = `https://www.car.gr/classifieds/cars/view/${id}/`;
    const browser = await playwright_1.default.chromium.launch();
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
    }
    catch (error) {
        await browser.close();
        return {
            name: `Car #${id}`,
            description: 'Failed to scrape.',
            error: error.message
        };
    }
}
exports.config = {
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
