// src/types.ts

// ✅ Corrigé : Base input for ID-based tools like scanWebsite
export interface ToolInputId {
  id?: number;
  index?: number;
}

// Full input for tools using filters
export interface PropertyFilterInput {
  prompt?: string; // ✅ nécessaire pour détecter les intentions implicites
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minFloor?: string;
  maxFloor?: string;
  minConstructionYear?: number;
  maxConstructionYear?: number;
  heatingType?: string[];
  frameType?: string[];
  furnished?: string[];
  states?: string[];
  categories?: string[];
  parentCategories?: string[];
  locationSearch?: string;

  // ✅ Extras as flat fields (for Claude compatibility)
  extra_student?: boolean;
  extra_seaFront?: boolean;
  extra_luxury?: boolean;
  extra_mountainView?: boolean;
  extra_neoclassical?: boolean;
  extra_investment?: boolean;
  extra_goldenVisa?: boolean;
}

// Result for all tools
export interface ToolResult {
  name: string;
  description: string;
  facts?: string[] | object[]; // ← accepte tableau structuré aussi
  error?: string;
  content?: string;
  // ❌ ne pas laisser ici __forceOutput directement si on veut que ToolResult reste propre
}

// ✅ Version étendue avec HTML brut (pour Claude)
export interface ToolResultWithHtml extends ToolResult {
  __forceOutput?: string;
}

// Schema describing input structure
export interface ToolConfig {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
}

// 🧠 Make Tool generic, with default input = ToolInputId
export interface Tool<TInput = ToolInputId> {
  run: (input: TInput) => Promise<ToolResult>;
  config: ToolConfig;
}
