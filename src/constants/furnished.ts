export enum Furnished {
    NONE = 'NONE',
    PARTIAL = 'PARTIAL',
    FULLY = 'FULLY',
  }
  
  export const VALID_FURNISHED: string[] = Object.values(Furnished);
  
  export const FURNISHED_DESCRIPTIONS: Record<Furnished, string> = {
    [Furnished.NONE]: 'Not furnished',
    [Furnished.PARTIAL]: 'Partially furnished',
    [Furnished.FULLY]: 'Fully furnished',
  };
  