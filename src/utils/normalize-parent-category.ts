const parentCategoryMapping: Record<string, string> = {
    'residential': 'RESIDENTIAL',
    'residence': 'RESIDENTIAL',
    'commercial': 'COMMERCIAL',
    'business': 'COMMERCIAL',
    'land': 'LAND',
    'plot': 'LAND',
    'parcel': 'LAND',
    'other': 'OTHER',
    'misc': 'OTHER',
  };
  
  export const normalizeParentCategories = (list: string[] = []) =>
    list
      .map(c =>
        parentCategoryMapping[c.trim().toLowerCase()] ?? c.toUpperCase()
      )
      .filter(c => ['RESIDENTIAL', 'COMMERCIAL', 'LAND', 'OTHER'].includes(c));
  