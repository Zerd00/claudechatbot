export function generatePropertyHtml(data: any): string {
    return `
      <h2>🏠 Apartment Code ${data.code}</h2>
      <ul>
        <li><strong>Price:</strong> €${data.price}</li>
        <li><strong>Area:</strong> ${data.area} m²</li>
        <li><strong>Bedrooms:</strong> ${data.bedrooms}</li>
        <li><strong>Bathrooms:</strong> ${data.bathrooms}</li>
        <li><strong>City:</strong> ${data.city}</li>
        <li><strong>Category:</strong> ${data.category}</li>
        <li><strong>Parent Category:</strong> ${data.parentCategory}</li>
      </ul>
      <p><a href="${data.url}" target="_blank">📎 View full listing</a></p>
    `.trim();
  }
  