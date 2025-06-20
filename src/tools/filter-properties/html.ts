import { FactItem } from './fact-utils';

// === Labels multilingues ===
const LABELS: Record<string, {
  property: string;
  price: string;
  city: string;
  availableProperties: string;
}> = {
  en: {
    property: "Property",
    price: "Price",
    city: "City",
    availableProperties: "Available Properties"
  },
  el: {
    property: "Ακίνητο",
    price: "Τιμή",
    city: "Πόλη",
    availableProperties: "Διαθέσιμα Ακίνητα"
  },
  fr: {
    property: "Bien",
    price: "Prix",
    city: "Ville",
    availableProperties: "Biens disponibles"
  }
  // Ajoute d'autres langues ici si besoin
};

// Génération du HTML joli avec images ET labels localisés
export function generatePropertiesHtml(facts: FactItem[], lang: string): string {
  const labels = LABELS[lang] || LABELS.en;
  return `
    <h2 style="font-family:'Segoe UI',Arial,sans-serif;font-size:2rem;margin:30px 0 18px 0;">
      ${labels.availableProperties}
    </h2>
    ${facts
      .map((item, idx) => `
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:32px;max-width:510px;">
          ${item.imageUrl ? `<img src="${item.imageUrl}" alt="Property Photo" style="width:110px;height:88px;object-fit:cover;border-radius:13px;box-shadow:0 2px 14px 0 rgba(60,70,120,0.10);">` : ''}
          <div>
            <div style="font-weight:bold;font-size:1.13rem;color:#315bb0;margin-bottom:5px;">
              ${labels.property} #${item.code}
            </div>
            <ul style="font-size:1.11rem;list-style:none;padding:0;margin:0;">
              <li><b>💶 ${labels.price}:</b> <span style="color:#27ae60;font-weight:500;">${item.price} €</span></li>
              <li><b>🏙️ ${labels.city}:</b> ${item.city}</li>
            </ul>
          </div>
        </div>
      `)
      .join('')}
  `;
}
