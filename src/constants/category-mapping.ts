// src/constants/category-mapping.ts

// Map souple de toutes les variations connues vers les noms stricts attendus par l'API
export const categoryMapping: Record<string, string> = {
    'house': 'DETACHED_HOUSE',
    'detached': 'DETACHED_HOUSE',
    'detached house': 'DETACHED_HOUSE',
    'detached houses': 'DETACHED_HOUSE',
    'detached_house': 'DETACHED_HOUSE',
    'detached-houses': 'DETACHED_HOUSE',
  
    'villa': 'VILLA',
    'studio': 'STUDIO',
    'apartment': 'APARTMENT',
    'loft': 'LOFT',
    'bungalow': 'BUNGALOW',
    'building': 'BUILDING',
    'farm': 'FARM',
    'houseboat': 'HOUSEBOAT',
    'apartment complex': 'APARTMENT_COMPLEX',
    'maisonette': 'MAISONETTE',
  
    // Commercial
    'office': 'OFFICE',
    'store': 'STORE',
    'warehouse': 'WAREHOUSE',
    'industrial space': 'INDUSTRIAL_SPACE',
    'craft space': 'CRAFT_SPACE',
    'hotel': 'HOTEL',
    'business building': 'BUSINESS_BUILDING',
    'hall': 'HALL',
    'showroom': 'SHOWROOM',
  
    // Land
    'plot': 'LAND_PLOT',
    'parcel': 'PARCELS',
    'island': 'ISLAND',
    'other land': 'OTHER_LAND',
  
    // Other
    'parking spot': 'PARKING',
    'business': 'BUSINESS',
    'prefabricated': 'PREFABRICATED',
    'detachable': 'DETACHABLE',
    'air': 'AIR',
    'other': 'OTHER'
  };
  