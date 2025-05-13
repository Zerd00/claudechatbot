const furnishedMapping: Record<string, string> = {
    'none': 'NONE',
    'not furnished': 'NONE',
    'partial': 'PARTIAL',
    'partially furnished': 'PARTIAL',
    'fully': 'FULLY',
    'furnished': 'FULLY',
    'fully furnished': 'FULLY',
  };
  
  export const normalizeFurnished = (values: string[] = []) =>
    values
      .map(f => furnishedMapping[f.trim().toLowerCase()] ?? f.toUpperCase())
      .filter(f => ['NONE', 'PARTIAL', 'FULLY'].includes(f));
  