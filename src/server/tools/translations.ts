// server/tools/translations.ts
export const translations: any = {
  en: {
    availableProperties: "Available Properties",
    property: "Property",
    price: "Price",
    city: "City",
    unknown: "Unknown"
  },
  el: {
    availableProperties: "Διαθέσιμα Ακίνητα",
    property: "Ακίνητο",
    price: "Τιμή",
    city: "Πόλη",
    unknown: "Άγνωστο"
  },
  fr: {
    availableProperties: "Biens disponibles",
    property: "Bien",
    price: "Prix",
    city: "Ville",
    unknown: "Inconnu"
  }
  // Ajoute ici d'autres langues si besoin
};

export function t(key: string, lang: string) {
  const dict = translations[lang] || translations['en'];
  return dict[key] || `[${lang}] ${key}`;
}
