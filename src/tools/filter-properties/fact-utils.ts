import { localize } from './localize';

// Typage unique partagé
export type FactItem = {
  code: string;
  price: number;
  city: string;
  imageUrl?: string;
};

// Fonction utilitaire pour construire FactItem[]
export function buildFacts(rawItems: any[], userLang: string): FactItem[] {
  return rawItems
    .filter((item: any) => item.code || item.id)
    .map((item: any) => {
      // Gestion de l'image
      let imageUrl = '';
      if (Array.isArray(item.images) && item.images.length > 0) {
        imageUrl = item.images[0];
        if (!/^https?:\/\//i.test(imageUrl)) {
          imageUrl = 'https://' + imageUrl;
        }
      }

      // Localisation du nom de ville
      let city = '';
      if (userLang.startsWith('el') || userLang.startsWith('gr')) {
        city = item.cityGR ?? item.city ?? item.cityEN ?? localize('Unknown', userLang);
      } else if (userLang === 'fr') {
        city = item.cityFR ?? item.cityEN ?? item.city ?? item.cityGR ?? localize('Unknown', userLang);
      } else {
        city = item.cityEN ?? item.city ?? item.cityGR ?? localize('Unknown', userLang);
      }

      return {
        code: item.code || item.id?.toString() || 'MISSING',
        price: item.price ?? 0,
        city,
        imageUrl
      };
    });
}
