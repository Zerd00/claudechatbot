import { PropertyFilterInput } from '../../types';
import { categoryMapping } from '../../constants/category-mapping';
import { normalizeFrameTypes } from '../../utils/normalize-frame-type';
import { normalizeFurnished } from '../../utils/normalize-furnished';
import { normalizeFloor } from '../../utils/normalize-floor';
import { normalizeHeating } from '../../utils/normalize-heating';
import { normalizeParentCategories } from '../../utils/normalize-parent-category';
import { normalizeStates } from '../../utils/normalize-states';

export function buildPayload(input: PropertyFilterInput): any {
  const mappedCategories = (input.categories ?? []).map(c => {
    const normalized = c.trim().toLowerCase()
      .replace(/[-_]/g, ' ')
      .replace(/\b(houses|homes)\b/g, 'house')
      .replace(/\s+/, ' ')
      .trim();
    return categoryMapping[normalized] ?? c;
  });

  return {
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
    heatingType: normalizeHeating(input.heatingType),
    frameType: normalizeFrameTypes(input.frameType),
    furnished: normalizeFurnished(input.furnished),
    states: normalizeStates(input.states),
    categories: mappedCategories,
    parentCategories: normalizeParentCategories(input.parentCategories),
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
}
