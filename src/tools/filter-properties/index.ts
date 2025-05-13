import { ToolConfig, ToolResult } from '../../types';
import type { PropertyFilterInput } from '../../types';
import { categoryMapping } from '../../constants/category-mapping';

import { normalizeFrameTypes } from '../../utils/normalize-frame-type';
import { normalizeFurnished } from '../../utils/normalize-furnished';
import { normalizeFloor } from '../../utils/normalize-floor';
import { normalizeHeating } from '../../utils/normalize-heating';
import { normalizeParentCategories } from '../../utils/normalize-parent-category';
import { normalizeStates } from '../../utils/normalize-states';

import fs from 'fs';
import path from 'path';

export async function run(input: PropertyFilterInput): Promise<ToolResult> {
  const mappedCategories = (input.categories ?? []).map(c => {
    const normalized = c.trim().toLowerCase()
      .replace(/[-_]/g, ' ')
      .replace(/\b(houses|homes)\b/g, 'house')
      .replace(/\s+/, ' ')
      .trim();
    return categoryMapping[normalized] ?? c;
  });

  if (!input.states?.length && /under maintenance|needs repair|renovation/i.test(input.prompt ?? '')) {
    input.states = ['UNDER_MAINTENANCE'];
  }

  const cleanedFrameType = normalizeFrameTypes(input.frameType);
  const cleanedFurnished = normalizeFurnished(input.furnished);
  const cleanedHeating = normalizeHeating(input.heatingType);
  const cleanedParentCategories = normalizeParentCategories(input.parentCategories);
  const cleanedStates = normalizeStates(input.states);

  const payload = {
    minPrice: input.minPrice ?? null,
    maxPrice: input.maxPrice ?? null,
    minArea: input.minArea ?? null,
    maxArea: input.maxArea ?? null,
    minBedrooms: input.minBedrooms ?? null,
    maxBedrooms: input.maxBedrooms ?? null,
    minFloor: normalizeFloor(input.minFloor),
    maxFloor: normalizeFloor(input.maxFloor),
    minConstructionYear: input.minConstructionYear ?? null,
    maxConstructionYear: input.maxConstructionYear ?? null,
    heatingType: cleanedHeating,
    frameType: cleanedFrameType,
    furnished: cleanedFurnished,
    states: cleanedStates,
    categories: mappedCategories,
    parentCategories: cleanedParentCategories,
    locationSearch: input.locationSearch ?? null,
    extras: {
      student: input.extra_student ?? false,
      seaFront: input.extra_seaFront ?? false,
      luxury: input.extra_luxury ?? false,
      mountainView: input.extra_mountainView ?? false,
      neoclassical: input.extra_neoclassical ?? false,
      investment: input.extra_investment ?? false,
      goldenVisa: input.extra_goldenVisa ?? false,
    },
  };

  console.log('[Claude FILTER request payload]', JSON.stringify(payload, null, 2));

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
  console.log('[Claude FILTER raw API response]', JSON.stringify(data, null, 2));

  // 🧠 Mémoire brute exacte, sans transformation ni index injecté
  const memoryPath = path.resolve(__dirname, '../../../memory/last-result.json');
  fs.writeFileSync(memoryPath, JSON.stringify(data, null, 2), 'utf-8');

  const items = data?.data?.items ?? [];
  const factsText = items.map((item: any) => ({
    id: item.id,
    code: item.code ?? null,
    title: item.title ?? 'Untitled',
    price: item.price ?? 0,
    area: item.area ?? null,
    bedrooms: item.bedrooms ?? null,
    bathrooms: item.bathrooms ?? null,
    city: item.location?.city ?? item.cityEN ?? item.cityGR ?? 'Unknown',
    url: `https://www.kopanitsanos.gr/en/property-detail/${item.id}`,
  }));

  console.log('[Claude JSON sent in factsText]', JSON.stringify(factsText, null, 2));

  return {
    name: 'Filtered properties',
    description: 'List of properties matching user filters.',
    facts: factsText,
  };
}

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
