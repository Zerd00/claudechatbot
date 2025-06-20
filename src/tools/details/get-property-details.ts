import fs from 'fs';
import path from 'path';
import { generatePropertyDetailHtml } from '../../server/tools/generate-property-detail-html';
import { detectUserLang } from '../filter-properties/localize'; // ✅ à ajouter, comme dans filterProperties

// Fonction pour retourner le HTML d'une propriété par code et langue
export async function getPropertyDetailsByCode(code: string, prompt: string = ''): Promise<string> {
  const memoryPath = path.resolve(__dirname, '../../../memory/last-result.json');
  if (!fs.existsSync(memoryPath)) return '<p>Memory file not found.</p>';

  const raw = fs.readFileSync(memoryPath, 'utf-8');
  let json: any;
  try {
    json = JSON.parse(raw);
  } catch {
    return '<p>Memory file is corrupted.</p>';
  }
  const items = Array.isArray(json) ? json : json?.data?.items ?? json?.items ?? [];
  const property = items.find((item: any) => String(item.code) === String(code));

  if (!property) return `<p>No property found with code ${code}.</p>`;

  // ✅ Détecte la langue (grec, anglais, etc.) du prompt
  const lang = await detectUserLang(prompt);
  // ✅ Passe la langue à ta génération de détail
  return generatePropertyDetailHtml(property, lang);
}

// MCP TOOL: getPropertyDetails
export const getPropertyDetails = {
  config: {
    name: 'getPropertyDetails',
    description: 'Get details for a specific property by code.',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Property code' },
        prompt: { type: 'string', description: 'Original user prompt for language detection' }, // ✅
      },
      required: ['code'],
    },
  },
  async run(input: { code: string, prompt?: string }) {
    // Ajoute le prompt à la détection de langue pour le détail !
    const html = await getPropertyDetailsByCode(input.code, input.prompt || '');
    return { content: html };
  },
};
