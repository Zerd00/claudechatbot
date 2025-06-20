export function generatePropertySummary(item: any): string {
  const parts: string[] = [];

  const code = item.code ?? 'N/A';
  const price = item.price !== undefined && item.price !== null ? `${item.price} €` : 'N/A';
  const city = item.city && typeof item.city === 'string' ? item.city : 'Unknown';

  parts.push(`<li><strong style="color:#e60000;">Code:</strong> ${code}</li>`);
  parts.push(`<li><strong>Price:</strong> ${price}</li>`);
  parts.push(`<li><strong>City:</strong> ${city}</li>`);

  return `<div style="margin-bottom: 20px;"><ul>${parts.join('')}</ul></div>`;
}
