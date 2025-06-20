// server/tools/generate-property-html.ts

import { t } from './translations';

export function generatePropertyHtml(properties: any[], lang: string = 'en'): string {
  if (!Array.isArray(properties) || properties.length === 0) {
    return `<p style="font-family:'Segoe UI',Arial,sans-serif;font-size:1.2rem;">${t('unknown', lang)}</p>`;
  }

  return `
    <h2 style="font-family:'Segoe UI',Arial,sans-serif;font-size:2rem;margin:30px 0 18px 0;">
      ${t('availableProperties', lang)}
    </h2>
    <div style="display:flex;flex-wrap:wrap;gap:32px;justify-content:center;margin-top:32px;">
      ${properties
        .map((item: any, idx: number) => {
          const safe = (val: any, fallback: string = '-') =>
            val !== undefined && val !== null && val !== '' ? val : fallback;
          return `
            <div style="
              background: #fff;
              border-radius: 18px;
              box-shadow: 0 4px 20px 0 rgba(44,62,80,0.14);
              padding: 30px 32px 20px 32px;
              width: 320px;
              min-height: 120px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              font-family: 'Segoe UI', Arial, sans-serif;
              margin-bottom: 10px;
              transition: box-shadow 0.2s;
            ">
              <div style="font-size: 1.05rem; color: #95a5a6; margin-bottom: 6px;">
                <span style="font-weight: bold; color: #315bb0; font-size: 1.23rem;">
                  ${t('property', lang)} #${safe(item.code)}
                </span>
              </div>
              <div style="margin-bottom: 10px;">
                <span style="font-size: 1.25rem;">💶 <b>${t('price', lang)}:</b></span>
                <span style="color: #27ae60; font-weight: bold; font-size: 1.22rem;">
                  ${safe(item.price)} €
                </span>
              </div>
              <div style="margin-bottom: 7px;">
                <span style="font-size: 1.13rem;">🏙️ <b>${t('city', lang)}:</b></span>
                <span style="color: #222;">
                  ${safe(item.city, t('unknown', lang))}
                </span>
              </div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}
