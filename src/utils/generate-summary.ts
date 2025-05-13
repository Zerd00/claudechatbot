export function generatePropertySummary(item: any) {
    const parts = [];
  
    if (item.id) parts.push(`<strong>Code:</strong> ${item.id}`);
    if (item.title) parts.push(`<strong>Title:</strong> ${item.title}`);
    if (item.city) parts.push(`<strong>City:</strong> ${item.city}`);
    if (item.area !== undefined && item.area !== null) parts.push(`<strong>Area:</strong> ${item.area} m²`);
    if (item.price !== undefined && item.price !== null) parts.push(`<strong>Price:</strong> ${item.price} €`);
    if (item.bedrooms !== undefined && item.bedrooms !== null) parts.push(`<strong>Bedrooms:</strong> ${item.bedrooms}`);
    if (item.bathrooms !== undefined && item.bathrooms !== null) parts.push(`<strong>Bathrooms:</strong> ${item.bathrooms}`);
  
    const url = item.url || (item.id ? `https://www.kopanitsanos.gr/en/property-detail/${item.id}` : null);
    if (url) parts.push(`<strong>Link:</strong> <a href="${url}" target="_blank">View Listing</a>`);
  
    return `<div style="margin-bottom: 20px;"><ul>${parts.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
  }
  