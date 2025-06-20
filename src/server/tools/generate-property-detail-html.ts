export function generatePropertyDetailHtml(property: any, lang: string = 'en'): string {
  // Multi-langue : labels selon langue
  const labels: Record<string, any> = {
    en: {
      title: 'Property',
      price: 'Price',
      perM2: 'per m²',
      address: 'Address',
      state: 'State',
      category: 'Category',
      area: 'Area',
      plotArea: 'Plot Area',
      frontage: 'Frontage',
      buildingBalance: 'Building Balance',
      yearOfConstruction: 'Year of Construction',
      floors: 'Floors',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      kitchens: 'Kitchens',
      livingRooms: 'Living Rooms',
      heatingType: 'Heating Type',
      energyClass: 'Energy Class',
      availableAfter: 'Available After',
      furnished: 'Furnished',
      floor: 'Floor',
      createdAt: 'Created At',
      description: 'Description',
      na: 'N/A',
    },
    el: {
      title: 'Ακίνητο',
      price: 'Τιμή',
      perM2: 'ανά τ.μ.',
      address: 'Διεύθυνση',
      state: 'Κατάσταση',
      category: 'Κατηγορία',
      area: 'Εμβαδόν',
      plotArea: 'Εμβαδόν οικοπέδου',
      frontage: 'Πρόσοψη',
      buildingBalance: 'Σ.Δ.',
      yearOfConstruction: 'Έτος κατασκευής',
      floors: 'Όροφοι',
      bedrooms: 'Υπνοδωμάτια',
      bathrooms: 'Μπάνια',
      kitchens: 'Κουζίνες',
      livingRooms: 'Σαλόνια',
      heatingType: 'Τύπος Θέρμανσης',
      energyClass: 'Ενεργειακή Κλάση',
      availableAfter: 'Διαθέσιμο από',
      furnished: 'Επιπλωμένο',
      floor: 'Όροφος',
      createdAt: 'Ημερ. καταχώρησης',
      description: 'Περιγραφή',
      na: 'Δ/Υ',
    },
    fr: {
      title: 'Propriété',
      price: 'Prix',
      perM2: 'par m²',
      address: 'Adresse',
      state: 'État',
      category: 'Catégorie',
      area: 'Surface',
      plotArea: 'Surface terrain',
      frontage: 'Façade',
      buildingBalance: 'COS',
      yearOfConstruction: 'Année de construction',
      floors: 'Étages',
      bedrooms: 'Chambres',
      bathrooms: 'Salles de bain',
      kitchens: 'Cuisines',
      livingRooms: 'Salons',
      heatingType: 'Type de chauffage',
      energyClass: 'Classe énergétique',
      availableAfter: 'Disponible après',
      furnished: 'Meublé',
      floor: 'Étage',
      createdAt: 'Créé le',
      description: 'Description',
      na: 'N/A',
    }
  };
  // Prend la langue détectée ou anglais par défaut
  const l = labels[lang] || labels.en;

  function getText(val: any): string {
    if (!val) return l.na;
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (val.label) return String(val.label);
    if (val.name) return String(val.name);
    if (val.value) return String(val.value);
    return Array.isArray(val)
      ? val.map(getText).join(', ')
      : JSON.stringify(val);
  }

  function formatDate(ts: any): string {
    if (!ts) return l.na;
    const date = typeof ts === 'string' && /^\d+$/.test(ts) ? new Date(Number(ts)) : new Date(ts);
    if (isNaN(date.getTime())) return String(ts);
    // Dates localisées
    if (lang === 'el') return date.toLocaleDateString('el-GR');
    if (lang === 'fr') return date.toLocaleDateString('fr-FR');
    return date.toLocaleDateString('en-GB');
  }

  // Ajout du préfixe https:// si nécessaire
  let imageUrl = '';
  if (Array.isArray(property.images) && property.images.length > 0) {
    imageUrl = property.images[0];
    if (!/^https?:\/\//i.test(imageUrl)) {
      imageUrl = 'https://' + imageUrl;
    }
  }

  const code = property.code || property.id || '';
  const price = property.price ? `${property.price} €` : l.na;
  const pricePerM2 = property.pricePerM2 ? `${property.pricePerM2} €` : l.na;
  const area = property.area ? `${property.area} m²` : l.na;
  const plotArea = property.plotArea ? `${property.plotArea} m²` : l.na;
  const frontage = getText(property.frontage);
  const buildingBalance = getText(property.buildingBalance);
  const yearOfConstruction = getText(property.yearOfConstruction);
  const floors = getText(property.floors);
  const bedrooms = getText(property.bedrooms ?? property.beds);
  const bathrooms = getText(property.bathrooms ?? property.baths);
  const kitchens = getText(property.kitchens);
  const livingRooms = getText(property.livingRooms);
  const heatingSystem = getText(property.heatingType ?? property.heatingSystem);
  const energyClass = getText(property.energyClass);
  const availableAfter = property.availableAfter ? formatDate(property.availableAfter) : l.na;
  const description = property.description || '';
  const address = property.address || [property.city, property.areaName, property.location, property.street].filter(Boolean).join(', ') || l.na;
  const state = getText(property.state);
  const category = getText(property.category);
  const createdAt = property.createdAt ? formatDate(property.createdAt) : l.na;
  const floor = getText(property.floor);
  const furnished = getText(property.furnished);

  return `
    <div style="
      max-width: 560px;
      margin: 40px auto;
      background: #fff;
      border-radius: 22px;
      box-shadow: 0 6px 32px 0 rgba(44, 62, 80, 0.10);
      padding: 36px 38px 30px 38px;
      font-family: 'Segoe UI', Arial, sans-serif;
    ">
      ${imageUrl ? `<img src="${imageUrl}" alt="Property Photo" style="width:100%;border-radius:10px;max-height:260px;object-fit:cover;margin-bottom:18px;">` : ''}
      <h2 style="font-size:2.1rem;margin-bottom:14px;">🏠 ${l.title} <span style="color:#315bb0;">#${code}</span></h2>
      <ul style="font-size:1.13rem;list-style:none;padding-left:0;margin-bottom:14px;">
        <li><b>💵 ${l.price}:</b> <span style="color:#27ae60;">${price}</span> (${pricePerM2} ${l.perM2})</li>
        <li><b>📍 ${l.address}:</b> ${address}</li>
        <li><b>🗺️ ${l.state}:</b> ${state}</li>
        <li><b>🏷️ ${l.category}:</b> ${category}</li>
        <li><b>📏 ${l.area}:</b> ${area}</li>
        <li><b>🏡 ${l.plotArea}:</b> ${plotArea}</li>
        <li><b>🧱 ${l.frontage}:</b> ${frontage}</li>
        <li><b>🏢 ${l.buildingBalance}:</b> ${buildingBalance}</li>
        <li><b>📅 ${l.yearOfConstruction}:</b> ${yearOfConstruction}</li>
        <li><b>🏬 ${l.floors}:</b> ${floors}</li>
        <li><b>🛏️ ${l.bedrooms}:</b> ${bedrooms}</li>
        <li><b>🛁 ${l.bathrooms}:</b> ${bathrooms}</li>
        <li><b>🍳 ${l.kitchens}:</b> ${kitchens}</li>
        <li><b>🛋️ ${l.livingRooms}:</b> ${livingRooms}</li>
        <li><b>🔥 ${l.heatingType}:</b> ${heatingSystem}</li>
        <li><b>⚡ ${l.energyClass}:</b> ${energyClass}</li>
        <li><b>🕒 ${l.availableAfter}:</b> ${availableAfter}</li>
        <li><b>🛋️ ${l.furnished}:</b> ${furnished}</li>
        <li><b>🏢 ${l.floor}:</b> ${floor}</li>
        <li><b>📅 ${l.createdAt}:</b> ${createdAt}</li>
      </ul>
      ${description ? `<div style="margin:12px 0 0 0;"><b>${l.description}:</b> <span>${description}</span></div>` : ''}
    </div>
  `;
}
