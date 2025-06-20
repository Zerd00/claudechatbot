export async function detectUserLang(prompt?: string): Promise<string> {
  console.log("=== detectUserLang EXECUTED === PROMPT =", prompt);

  if (!prompt) {
    console.log("[LANG DETECT] No prompt, fallback en");
    return 'en';
  }

  // (1) Priorité : caractères grecs
  if (/[Α-Ωα-ωΆΈΉΊΌΎΏάέήίόύώϊϋΐΰ]/.test(prompt)) {
    console.log("[LANG DETECT] Caractère grec détecté !");
    return 'el';
  }

  // (2) Cyrillic test (ru, bg, etc)
  if (/[А-Яа-яЁё]/.test(prompt)) {
    console.log("[LANG DETECT] Caractère cyrillique détecté !");
    return 'ru';
  }

  // (3) Fallback franc-min
  try {
    const { franc } = await import('franc');
    const francLang = franc(prompt);
    console.log("[LANG DETECT] franc-min result =", francLang);

    if (francLang === 'gre') {
      console.log("[LANG DETECT] Franc détecte 'gre' (grec)");
      return 'el';
    }
    if (francLang === 'fra') {
      console.log("[LANG DETECT] Franc détecte 'fra' (français)");
      return 'fr';
    }
    if (francLang === 'rus') {
      console.log("[LANG DETECT] Franc détecte 'rus' (russe)");
      return 'ru';
    }
  } catch (e) {
    console.log("[LANG DETECT] ERREUR franc-min:", e);
  }

  console.log("[LANG DETECT] Aucun match, fallback en");
  return 'en';
}

// Version ultra-simple du localize pour debug
export function localize(key: string, lang: string): string {
  return `[${lang.toUpperCase()}] ${key}`;
}
