import { ToolConfig, ToolResult } from '../../types';
import type { PropertyFilterInput } from '../../types';

import fs from 'fs';
import path from 'path';

import { detectUserLang } from './localize';
import { buildFacts, FactItem } from './fact-utils';
import { generatePropertiesHtml } from './html';
import { buildPayload } from './build-payload';
import { extractRawItems } from './extract-raw-items';
import { debug } from './logger';

type ToolResultWithHtml = ToolResult & {
  __forceOutput?: string;
};

export async function run(input: PropertyFilterInput): Promise<ToolResultWithHtml> {
  // Robust language detection (greek alphabet prioritized)
  const userLang = await detectUserLang(input.prompt);
  console.log('[DEBUG] Langue détectée automatiquement:', userLang);

  // Add maintenance state if detected in prompt
  if (!input.states?.length && /under maintenance|needs repair|renovation/i.test(input.prompt ?? '')) {
    input.states = ['UNDER_MAINTENANCE'];
  }

  // Build the filtered API payload
  const payload = buildPayload(input);

  debug('[Claude FILTER request payload]', JSON.stringify(payload, null, 2));

  const response = await fetch('https://property-pro.gr/api/v0.1/public/property/filter/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Company-Id': '3',
      'Site-Id': '1',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  debug('[Claude FILTER raw API response]', JSON.stringify(data, null, 2));
  debug('[DEBUG] top-level keys in response:', Object.keys(data));

  // Save to memory (debug or contextual recall)
  const memoryPath = path.resolve(__dirname, '../../../memory/last-result.json');
  fs.writeFileSync(memoryPath, JSON.stringify(data, null, 2), 'utf-8');

  // Extract the property list
  const rawItems = extractRawItems(data);
  debug('[DEBUG] rawItems after fallback:', rawItems.length);

  // Build the localized facts list
  const factsText: FactItem[] = buildFacts(rawItems, userLang);
  debug('[DEBUG] Final factsText before return:', factsText);
  debug('[Claude JSON sent in factsText]', JSON.stringify(factsText, null, 2));

  // Suggestion messages if no results
  const suggestions: Record<string, string> = {
    en: "No results found. Would you like to increase your budget or consider other areas?",
    el: "Δεν βρέθηκαν αποτελέσματα. Θέλετε να αυξήσετε τον προϋπολογισμό σας ή να εξετάσετε άλλες περιοχές;",
    fr: "Aucun résultat trouvé. Voulez-vous augmenter votre budget ou considérer d'autres zones ?"
  };

  // === PATCH: FILTER valid items only ===
  const validFacts = factsText.filter(
    item => item && item.code && item.price
  );

  let html: string;
  if (!validFacts.length) {
    html = `
      <h2 style="font-family:'Segoe UI',Arial,sans-serif;font-size:2rem;margin:30px 0 18px 0;color:#9b1c2e;">
        ${suggestions[userLang] || suggestions.en}
      </h2>
    `;
  } else {
    html = generatePropertiesHtml(validFacts, userLang);
  }

  return {
    name: 'Filtered properties',
    description: !validFacts.length
      ? suggestions[userLang] || suggestions.en
      : 'List of properties matching user filters.',
    facts: validFacts,
    __forceOutput: html,
  };
}

// Export du schéma de config MCP (inchangé)
export const config: ToolConfig = {
  name: 'filterProperties',
  description: 'Search properties using filters like price range, area, location...',
  inputSchema: {
    type: 'object',
    properties: {
      minPrice: { type: 'number', description: 'Minimum price' },
      maxPrice: { type: 'number', description: 'Maximum price' },
      minArea: { type: 'number', description: 'Minimum area (m²)' },
      maxArea: { type: 'number', description: 'Maximum area (m²)' },
      minBedrooms: { type: 'number', description: 'Minimum number of bedrooms' },
      maxBedrooms: { type: 'number', description: 'Maximum number of bedrooms' },
      minFloor: {
        type: 'string',
        description: 'Minimum floor level (e.g., "GROUND_FLOOR", "1", ..., "50")',
      },
      maxFloor: {
        type: 'string',
        description: 'Maximum floor level (e.g., "GROUND_FLOOR", "1", ..., "50")',
      },
      minConstructionYear: { type: 'number', description: 'Earliest construction year' },
      maxConstructionYear: { type: 'number', description: 'Latest construction year' },
      heatingType: {
        type: 'array',
        description: 'Accepted heating types (e.g., CENTRAL, NO_HEATING, AUTONOMOUS, SELF_USE)',
      },
      frameType: {
        type: 'array',
        description: 'Accepted frame types (e.g., WOODEN, SYNTHETIC, ALUMINIUM, etc.)',
      },
      furnished: {
        type: 'array',
        description: 'Furnished options (e.g., NONE, PARTIAL, FULLY)',
      },
      states: {
        type: 'array',
        description: 'Accepted states (e.g., SALE, RENT, SOLD, RENTED, etc.)',
      },
      categories: { type: 'array', description: 'Accepted property categories' },
      parentCategories: {
        type: 'array',
        description: 'Accepted parent categories (RESIDENTIAL, COMMERCIAL, LAND, OTHER)',
      },
      locationSearch: { type: 'string', description: 'Search by city or region' },
      extra_student: { type: 'boolean', description: 'Student-friendly property' },
      extra_seaFront: { type: 'boolean', description: 'Located on the sea front' },
      extra_luxury: { type: 'boolean', description: 'Luxury property' },
      extra_mountainView: { type: 'boolean', description: 'Mountain view available' },
      extra_neoclassical: { type: 'boolean', description: 'Neoclassical style' },
      extra_investment: { type: 'boolean', description: 'Good for investment' },
      extra_goldenVisa: { type: 'boolean', description: 'Eligible for Golden Visa' },
    },
    required: [],
  },
};
