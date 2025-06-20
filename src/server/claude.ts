// server/claude.ts
import fetch from 'node-fetch';

// === Fonction utilitaire : split un long HTML en chunks
export function splitHtmlIntoChunks(html: string, maxLength = 8000): string[] {
  const parts: string[] = [];
  let current = '';

  for (const line of html.split('</ul>')) {
    if ((current + line).length > maxLength) {
      parts.push(current);
      current = '';
    }
    current += line + '</ul>';
  }

  if (current) parts.push(current);
  return parts;
}

// === 1. Premier appel à Claude : sélection d'outil (AJOUT param system facultatif) ===
export async function callClaude(
  prompt: string,
  claudeTools?: any[],         // facultatif !
  tool_choice?: any,           // facultatif !
  system?: string              // facultatif !
) {
  // Création dynamique du payload
  const payload: any = {
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    system:
      system ||
      `You are a real estate assistant.
Always use the tool "getPropertyDetails" when the user mentions "details", "more info", "expand", or "show more".
Never use "filterProperties" to provide details.
Never invent, rephrase or guess property details.
Only structure what you receive inside the tool_result.
NEVER summarize the result. REPEAT VERBATIM the HTML that was sent to you in previous assistant message.`,
    messages: [{ role: 'user', content: prompt }],
  };

  // 👉 N'ajoute tools et tool_choice QUE s'ils sont définis (et non vides)
  if (claudeTools && claudeTools.length > 0) payload.tools = claudeTools;
  if (tool_choice && tool_choice.type !== 'none') payload.tool_choice = tool_choice;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return data;
}

// === 2. Deuxième appel à Claude : "repeat as is" sur le HTML chunké ===
export async function callClaudeFollowUp(chunkedMessages: any[]) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: chunkedMessages,
    }),
  });

  const data = await response.json();
  return data;
}
